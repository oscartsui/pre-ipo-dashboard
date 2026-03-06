import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Info, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  MessageCircle, 
  Twitter, 
  Languages, 
  Sun, 
  Moon 
} from 'lucide-react';

const App = () => {
  const [lang, setLang] = useState('zh'); // 'zh' or 'en'
  const [isDark, setIsDark] = useState(true); // Default to Dark based on user reference

  // 翻译字典
  const t = {
    zh: {
      navTitle: "Pre-IPO 资产看板",
      twitter: "关注推特",
      community: "加入社区",
      listTitle: "资产列表",
      listDesc: "追踪全球顶尖独角兽企业的 Token 化二级市场份额",
      searchPlaceholder: "搜索资产或名称...",
      colToken: "Pre-IPO Token / 来源",
      colPrice: "Token 价格",
      colValuation: "隐含估值",
      colRemarks: "备注与特征",
      colAction: "操作",
      source: "来源",
      underlying: "底层资产",
      buy: "立即购买",
      riskTitle: "风险提示",
      riskDesc: "Pre-IPO Token 属于高风险另类资产，其隐含估值基于平台流动性计算，可能与实际估值存在偏差。所有数据仅供参考，不构成任何投资建议。",
      noData: "没有找到相关资产"
    },
    en: {
      navTitle: "Pre-IPO Dashboard",
      twitter: "Twitter",
      community: "Community",
      listTitle: "Asset List",
      listDesc: "Track tokenized secondary market shares of global top unicorns",
      searchPlaceholder: "Search assets...",
      colToken: "Pre-IPO Token / Source",
      colPrice: "Token Price",
      colValuation: "Implied Valuation",
      colRemarks: "Remarks & Features",
      colAction: "Action",
      source: "Source",
      underlying: "Underlying",
      buy: "Buy Now",
      riskTitle: "Risk Warning",
      riskDesc: "Pre-IPO Tokens are high-risk alternative assets. Implied valuations are calculated based on platform liquidity and may deviate from actual valuations. Data is for reference only.",
      noData: "No assets found"
    }
  };

  const [tokens] = useState([
    {
      id: 1,
      tokenName: "TSpaceX",
      source: "Tessera",
      underlyingAsset: "SpaceX",
      price: "$112.50",
      impliedValuation: "$210B",
      remarks: { zh: ["高流动性", "稀缺份额"], en: ["High Liquidity", "Scarce"] },
      status: "Open",
      trend: "+2.4%"
    },
    {
      id: 2,
      tokenName: "TOpenAI",
      source: "Jarsy",
      underlyingAsset: "OpenAI",
      price: "$285.00",
      impliedValuation: "$86B",
      remarks: { zh: ["AI 龙头", "机构溢价"], en: ["AI Leader", "Premium"] },
      status: "Hot",
      trend: "+5.1%"
    },
    {
      id: 3,
      tokenName: "TStripe",
      source: "Tessera",
      underlyingAsset: "Stripe",
      price: "$24.15",
      impliedValuation: "$65B",
      remarks: { zh: ["支付巨头", "IPO 传闻"], en: ["Fintech", "IPO Rumors"] },
      status: "Stable",
      trend: "-0.5%"
    },
    {
      id: 4,
      tokenName: "TAnthropic",
      source: "Jarsy",
      underlyingAsset: "Anthropic",
      price: "$35.80",
      impliedValuation: "$18.4B",
      remarks: { zh: ["早期额度", "技术领先"], en: ["Early Access", "Tech Lead"] },
      status: "New",
      trend: "+12.8%"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = tokens.filter(t => 
    t.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.underlyingAsset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 动态主题样式
  const theme = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50',
    nav: isDark ? 'bg-[#121212] border-[#222]' : 'bg-white border-gray-100',
    card: isDark ? 'bg-[#181818] border-[#2a2a2a]' : 'bg-white border-gray-100',
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-gray-400' : 'text-slate-500',
    tableHeader: isDark ? 'bg-[#222]/50 border-[#2a2a2a]' : 'bg-slate-50/50 border-gray-100',
    rowHover: isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50/50',
    input: isDark ? 'bg-[#1e1e1e] border-[#333] text-white focus:border-blue-500' : 'bg-white border-gray-200 text-slate-900 focus:ring-blue-500/20',
    tag: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100',
    valuationBg: isDark ? 'bg-[#222] border-[#333]' : 'bg-slate-100 border-slate-200',
    btnBuy: isDark ? 'bg-[#c5a059] hover:bg-[#b38f4d] text-[#0a0a0a]' : 'bg-blue-600 hover:bg-blue-700 text-white'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} font-sans pb-20 transition-colors duration-300`}>
      {/* 导航栏 */}
      <nav className={`${theme.nav} border-b sticky top-0 z-50 shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${isDark ? 'bg-[#c5a059]' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
              <TrendingUp className={`${isDark ? 'text-[#0a0a0a]' : 'text-white'} w-5 h-5`} />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
              {t[lang].navTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* 主题切换 */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg border ${isDark ? 'border-[#333] hover:bg-[#222]' : 'border-gray-200 hover:bg-gray-50'} transition-all text-slate-400`}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* 中英文切换 */}
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isDark ? 'border-[#333] text-gray-300 hover:bg-[#222]' : 'border-gray-200 text-slate-600 hover:bg-gray-50'} transition-colors text-sm font-medium`}
            >
              <Languages size={16} />
              <span className="hidden sm:inline">{lang === 'zh' ? 'English' : '中文'}</span>
              <span className="sm:hidden">{lang === 'zh' ? 'EN' : 'CN'}</span>
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <button className={`flex items-center gap-1 px-4 py-2 border rounded-full text-sm font-medium ${isDark ? 'border-[#333] text-gray-300 hover:bg-[#222]' : 'border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                <Twitter size={16} />
                <span>{t[lang].twitter}</span>
              </button>
              <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                <MessageCircle size={16} />
                <span>{t[lang].community}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* 顶部标题与搜索 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t[lang].listTitle}</h2>
            <p className={`${theme.textSub} text-sm mt-1`}>{t[lang].listDesc}</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={t[lang].searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all ${theme.input}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 核心表格容器 */}
        <div className={`rounded-2xl shadow-xl border ${theme.card} overflow-hidden transition-colors duration-300`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${theme.tableHeader} border-b`}>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t[lang].colToken}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t[lang].colPrice}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t[lang].colValuation}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t[lang].colRemarks}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">{t[lang].colAction}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#2a2a2a]' : 'divide-gray-50'}`}>
                {filteredTokens.map((token) => (
                  <tr key={token.id} className={`${theme.rowHover} transition-colors group`}>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${theme.textMain}`}>{token.tokenName}</span>
                          {token.status === 'Hot' && (
                            <span className="bg-orange-500/10 text-orange-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight border border-orange-500/20">Hot</span>
                          )}
                        </div>
                        <div className="flex flex-col mt-2 space-y-1">
                          <div className={`flex items-center gap-1.5 text-xs ${theme.textSub}`}>
                            <ShieldCheck size={12} className="text-blue-500" />
                            <span>{t[lang].source}: <span className={isDark ? 'text-gray-200' : 'text-slate-700'}>{token.source}</span></span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs ${theme.textSub}`}>
                            <Globe size={12} className="text-emerald-500" />
                            <span>{t[lang].underlying}: <span className={isDark ? 'text-gray-200' : 'text-slate-700'}>{token.underlyingAsset}</span></span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className={`text-xl font-bold font-mono tracking-tight ${isDark ? 'text-amber-400' : 'text-amber-500'}`}>{token.price}</span>
                        <span className={`text-[11px] font-bold mt-0.5 ${token.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {token.trend}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border ${theme.valuationBg}`}>
                        <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{token.impliedValuation}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-2">
                        {token.remarks[lang].map((remark, idx) => (
                          <span 
                            key={idx} 
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border whitespace-nowrap ${theme.tag}`}
                          >
                            {remark}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-6 text-right">
                      <button className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 ml-auto ${theme.btnBuy}`}>
                        <span>{t[lang].buy}</span>
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTokens.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              <p>{t[lang].noData}</p>
            </div>
          )}
        </div>

        {/* 底部免责声明 */}
        <div className={`mt-8 p-5 rounded-2xl border shadow-sm flex gap-4 transition-colors ${isDark ? 'bg-[#181818] border-[#2a2a2a]' : 'bg-white border-gray-100'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <Info className="text-amber-500" size={20} />
          </div>
          <div>
            <h4 className={`text-sm font-bold mb-1 ${theme.textMain}`}>{t[lang].riskTitle}</h4>
            <p className={`text-xs leading-relaxed ${theme.textSub}`}>
              {t[lang].riskDesc}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;