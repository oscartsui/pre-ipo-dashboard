#!/bin/bash
# 定时更新 Token 价格脚本
# 从各 API 获取最新价格，计算 implied valuation，更新 Supabase 数据库

SUPABASE_URL="https://zvdmtgmkddivkouumulx.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZG10Z21rZGRpdmtvdXVtdWx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcyNzgwNCwiZXhwIjoyMDg4MzAzODA0fQ.jiKMiTThGjqb5AoaU6k4RLHhTUVHJz1ZZQIVum8SZes"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting price update..."

NOW_MS=$(date +%s)000

# 获取所有有 price_api_url 的 Token
TOKENS=$(curl -s "${SUPABASE_URL}/rest/v1/tokens?price_api_url=not.is.null&select=id,token_name,price,price_api_url,valuation_multiplier" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

echo "$TOKENS" | jq -c '.[]' | while read -r token; do
  TOKEN_ID=$(echo "$token" | jq -r '.id')
  TOKEN_NAME=$(echo "$token" | jq -r '.token_name')
  OLD_PRICE=$(echo "$token" | jq -r '.price')
  API_URL_TEMPLATE=$(echo "$token" | jq -r '.price_api_url')
  MULTIPLIER=$(echo "$token" | jq -r '.valuation_multiplier // empty')

  API_URL=$(echo "$API_URL_TEMPLATE" | sed "s/{NOW}/${NOW_MS}/g")

  echo "  Updating ${TOKEN_NAME} (id=${TOKEN_ID})..."

  PRICE_DATA=$(curl -s "$API_URL" 2>/dev/null)
  
  if [ -z "$PRICE_DATA" ] || echo "$PRICE_DATA" | jq -e '.status' > /dev/null 2>&1; then
    echo "    ERROR: Failed to fetch price data"
    continue
  fi

  NEW_PRICE_RAW=$(echo "$PRICE_DATA" | jq -r '.candles[-1].close // empty')
  PREV_PRICE_RAW=$(echo "$PRICE_DATA" | jq -r '.candles[-2].close // empty')

  if [ -z "$NEW_PRICE_RAW" ]; then
    echo "    ERROR: Could not parse price"
    continue
  fi

  # 格式化价格
  NEW_PRICE=$(printf "\$%.2f" "$NEW_PRICE_RAW")

  # 计算涨跌幅
  TREND_STR="+0.0%"
  if [ -n "$PREV_PRICE_RAW" ] && [ "$PREV_PRICE_RAW" != "0" ]; then
    TREND=$(echo "scale=2; ($NEW_PRICE_RAW - $PREV_PRICE_RAW) / $PREV_PRICE_RAW * 100" | bc 2>/dev/null)
    if [ -n "$TREND" ]; then
      if echo "$TREND" | grep -q "^-"; then
        TREND_STR="${TREND}%"
      else
        TREND_STR="+${TREND}%"
      fi
    fi
  fi

  # 计算 implied valuation
  VALUATION_STR=""
  if [ -n "$MULTIPLIER" ] && [ "$MULTIPLIER" != "null" ]; then
    VALUATION_RAW=$(echo "$NEW_PRICE_RAW * $MULTIPLIER" | bc 2>/dev/null)
    if [ -n "$VALUATION_RAW" ]; then
      # 转换为可读格式: T (万亿), B (十亿), M (百万)
      VALUATION_T=$(echo "scale=2; $VALUATION_RAW / 1000000000000" | bc 2>/dev/null)
      VALUATION_B=$(echo "scale=2; $VALUATION_RAW / 1000000000" | bc 2>/dev/null)
      
      # 判断用 T 还是 B
      IS_TRILLION=$(echo "$VALUATION_RAW >= 1000000000000" | bc 2>/dev/null)
      if [ "$IS_TRILLION" = "1" ]; then
        VALUATION_STR="\$${VALUATION_T}T"
      else
        VALUATION_STR="\$${VALUATION_B}B"
      fi
    fi
  fi

  echo "    Price: ${OLD_PRICE} → ${NEW_PRICE} (${TREND_STR})"
  [ -n "$VALUATION_STR" ] && echo "    Valuation: ${VALUATION_STR}"

  # 构建更新 JSON
  UPDATE_JSON="{\"price\": \"${NEW_PRICE}\", \"trend\": \"${TREND_STR}\", \"price_updated_at\": \"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\""
  if [ -n "$VALUATION_STR" ]; then
    UPDATE_JSON="${UPDATE_JSON}, \"implied_valuation\": \"${VALUATION_STR}\""
  fi
  UPDATE_JSON="${UPDATE_JSON}}"

  RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "${SUPABASE_URL}/rest/v1/tokens?id=eq.${TOKEN_ID}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -d "$UPDATE_JSON")

  if [ "$RESULT" = "204" ]; then
    echo "    Updated!"
  else
    echo "    ERROR: Update failed (HTTP ${RESULT})"
  fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Price update complete."
