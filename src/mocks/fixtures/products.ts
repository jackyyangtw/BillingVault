export type Product = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  price: number;
  accent: "primary" | "emerald" | "amber" | "violet" | "rose" | "sky";
  highlights: string[];
  useCases: string[];
  securityNotes: string[];
};

export const products: Product[] = [
  {
    id: "codeguard",
    name: "CodeGuard",
    tagline: "依賴套件安全掃描與 CI 風險警告",
    summary:
      "在 pull request、CI pipeline 與版本發布前攔截高風險依賴，讓團隊把安全檢查放進日常開發節奏。",
    price: 19,
    accent: "primary",
    highlights: ["依賴漏洞掃描", "CI 風險等級標記", "修補建議與版本比對"],
    useCases: ["開源套件風險控管", "PR 安全審核", "發布前檢查清單"],
    securityNotes: ["最小權限 token", "稽核記錄", "Webhook 簽章驗證"],
  },
  {
    id: "deploywatch",
    name: "DeployWatch",
    tagline: "部署監控與版本發布追蹤",
    summary:
      "把每次部署、回滾、環境差異與服務健康度收在同一個視圖，縮短事故定位時間。",
    price: 15,
    accent: "emerald",
    highlights: ["部署事件時間線", "環境健康檢查", "回滾風險提示"],
    useCases: ["Release 監控", "事故回溯", "版本差異追蹤"],
    securityNotes: ["環境權限分離", "操作記錄留存", "安全回調 URL"],
  },
  {
    id: "errorpulse",
    name: "ErrorPulse",
    tagline: "前端錯誤追蹤與 Session 診斷",
    summary:
      "收集前端錯誤、使用者操作脈絡與瀏覽器環境，協助團隊重現並修復高影響問題。",
    price: 29,
    accent: "amber",
    highlights: ["錯誤分組", "Session breadcrumb", "影響使用者分析"],
    useCases: ["前端例外追蹤", "轉換流程除錯", "瀏覽器相容性分析"],
    securityNotes: ["敏感資料遮罩", "CSP 相容上報", "資料保留週期設定"],
  },
  {
    id: "metricflow",
    name: "MetricFlow",
    tagline: "產品分析與轉換率儀表板",
    summary:
      "追蹤漏斗、事件與訂閱轉換率，讓產品和工程團隊能用同一套指標討論成長。",
    price: 39,
    accent: "violet",
    highlights: ["轉換漏斗", "方案升級分析", "自訂事件儀表板"],
    useCases: ["訂閱轉換分析", "功能採用率", "營收實驗追蹤"],
    securityNotes: ["事件資料白名單", "匿名化識別", "團隊權限控管"],
  },
  {
    id: "teamvault",
    name: "TeamVault",
    tagline: "安全團隊工作區與存取控制",
    summary:
      "管理團隊席位、角色權限與敏感操作審核，適合需要更細權限邊界的 SaaS 團隊。",
    price: 49,
    accent: "rose",
    highlights: ["角色權限矩陣", "席位用量管理", "敏感操作審核"],
    useCases: ["團隊權限管理", "資安審核", "大型組織席位控管"],
    securityNotes: ["RBAC", "登入紀錄", "高風險操作二次確認"],
  },
  {
    id: "alertgrid",
    name: "AlertGrid",
    tagline: "多通道事件警報與待命排班路由",
    summary:
      "把錯誤、部署、帳務與安全事件路由到正確負責人，降低重要警報被忽略的機率。",
    price: 25,
    accent: "sky",
    highlights: ["多通道通知", "值班排程", "事件升級規則"],
    useCases: ["事故通知", "付款失敗提醒", "安全事件升級"],
    securityNotes: ["簽章驗證", "頻率限制", "通知目標權限檢查"],
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
