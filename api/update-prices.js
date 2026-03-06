// Vercel Serverless Function: 定时更新 Token 价格
// 从 Jupiter API 获取最新价格，计算 implied valuation，更新 Supabase

module.exports = async function handler(req, res) {
  // 验证请求（防止被随意调用）
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    // 获取所有有 price_api_url 的 Token
    const tokensRes = await fetch(
      `${SUPABASE_URL}/rest/v1/tokens?price_api_url=not.is.null&select=id,token_name,price,price_api_url,valuation_multiplier`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const tokens = await tokensRes.json();

    const results = [];
    const nowMs = Date.now();

    for (const token of tokens) {
      try {
        // 替换 {NOW} 占位符
        const apiUrl = token.price_api_url.replace('{NOW}', nowMs.toString());

        // 获取价格数据
        const priceRes = await fetch(apiUrl);
        const priceData = await priceRes.json();

        if (!priceData.candles || priceData.candles.length === 0) {
          results.push({ id: token.id, name: token.token_name, error: 'No candle data' });
          continue;
        }

        const candles = priceData.candles;
        const latestClose = candles[candles.length - 1].close;
        const prevClose = candles.length >= 2 ? candles[candles.length - 2].close : null;

        // 格式化价格
        const newPrice = `$${latestClose.toFixed(2)}`;

        // 计算涨跌幅
        let trendStr = '+0.0%';
        if (prevClose && prevClose !== 0) {
          const trend = ((latestClose - prevClose) / prevClose * 100).toFixed(2);
          trendStr = trend >= 0 ? `+${trend}%` : `${trend}%`;
        }

        // 计算 implied valuation
        let valuationStr = null;
        if (token.valuation_multiplier) {
          const valuation = latestClose * token.valuation_multiplier;
          if (valuation >= 1e12) {
            valuationStr = `$${(valuation / 1e12).toFixed(2)}T`;
          } else if (valuation >= 1e9) {
            valuationStr = `$${(valuation / 1e9).toFixed(2)}B`;
          } else if (valuation >= 1e6) {
            valuationStr = `$${(valuation / 1e6).toFixed(2)}M`;
          }
        }

        // 更新数据库
        const updateData = {
          price: newPrice,
          trend: trendStr,
          price_updated_at: new Date().toISOString(),
        };
        if (valuationStr) {
          updateData.implied_valuation = valuationStr;
        }

        await fetch(`${SUPABASE_URL}/rest/v1/tokens?id=eq.${token.id}`, {
          method: 'PATCH',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        results.push({
          id: token.id,
          name: token.token_name,
          price: newPrice,
          trend: trendStr,
          valuation: valuationStr,
          status: 'updated',
        });
      } catch (err) {
        results.push({ id: token.id, name: token.token_name, error: err.message });
      }
    }

    return res.status(200).json({ 
      success: true, 
      updated_at: new Date().toISOString(),
      results 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
