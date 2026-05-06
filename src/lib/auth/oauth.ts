/**
 * OAuth 授權 URL 工具
 *
 * 根據 provider 組合 OAuth 2.0 授權 URL。
 * - 有環境變數時使用真實 OAuth URL
 * - 無環境變數時 fallback 到 mock 模式（直接導向 callback 頁面帶 mock code）
 *
 * 安全措施：
 * - CSRF 防護：使用 crypto random 產生 state，存入 sessionStorage 驗證
 * - Provider 白名單：只允許已設定的 provider
 *
 * @module lib/auth/oauth
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OAuthProviderConfig {
  /** OAuth 授權端點 */
  authUrl: string;
  /** 申請的權限範圍 */
  scope: string;
  /** 環境變數中的 client_id key（NEXT_PUBLIC_ prefix） */
  clientIdEnvKey: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** sessionStorage key，用於存放 CSRF state */
const OAUTH_STATE_KEY = "oauth_state";

/** callback 處理的超時時間（毫秒） */
export const OAUTH_CALLBACK_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Provider Configs
// ---------------------------------------------------------------------------

const PROVIDER_CONFIGS: Record<string, OAuthProviderConfig> = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
    clientIdEnvKey: "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  },
  facebook: {
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    scope: "email,public_profile",
    clientIdEnvKey: "NEXT_PUBLIC_FACEBOOK_CLIENT_ID",
  },
  line: {
    authUrl: "https://access.line.me/oauth2/v2.1/authorize",
    scope: "openid profile email",
    clientIdEnvKey: "NEXT_PUBLIC_LINE_CLIENT_ID",
  },
};

/** 支援的 provider 清單（白名單） */
export const SUPPORTED_PROVIDERS = Object.keys(PROVIDER_CONFIGS);

// ---------------------------------------------------------------------------
// CSRF State 管理
// ---------------------------------------------------------------------------

/**
 * 產生 CSRF state 並存入 sessionStorage
 *
 * 使用 crypto.randomUUID() 產生不可預測的隨機值。
 * 存入 sessionStorage（僅當前 tab 可讀取）。
 */
function generateAndStoreState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
}

/**
 * 驗證 CSRF state
 *
 * 比對 callback 回傳的 state 是否與 sessionStorage 中的一致。
 * 驗證後立即清除 sessionStorage 中的值（一次性使用）。
 *
 * @returns 驗證是否通過
 */
export function validateOAuthState(state: string | null): boolean {
  if (!state) return false;

  const stored = sessionStorage.getItem(OAUTH_STATE_KEY);
  // 驗證後立即清除（防止重放攻擊）
  sessionStorage.removeItem(OAUTH_STATE_KEY);

  return stored === state;
}

/**
 * 檢查 provider 是否在白名單中
 */
export function isValidProvider(provider: string): boolean {
  return SUPPORTED_PROVIDERS.includes(provider.toLowerCase());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 取得 OAuth 授權 URL
 *
 * @param provider - Provider 名稱（Google / Facebook / LINE，不分大小寫）
 * @returns 授權 URL 字串
 *
 * @example
 * ```ts
 * const url = getOAuthUrl("Google");
 * window.open(url, "oauth-popup", "width=500,height=600");
 * ```
 */
export function getOAuthUrl(provider: string): string {
  const key = provider.toLowerCase();
  const config = PROVIDER_CONFIGS[key];

  if (!config) {
    throw new Error(`不支援的 OAuth provider: ${provider}`);
  }

  const clientId =
    typeof window !== "undefined"
      ? // Client-side：從 env 讀取
        process.env[config.clientIdEnvKey]
      : undefined;

  const redirectUri = `${window.location.origin}/auth/callback/${key}`;
  const state = generateAndStoreState();

  // 無 client_id → mock 模式：直接導向 callback 頁面帶 mock code
  if (!clientId) {
    const mockParams = new URLSearchParams({
      code: `mock-code-${key}-${Date.now()}`,
      state,
    });
    return `${redirectUri}?${mockParams.toString()}`;
  }

  // 有 client_id → 真實 OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scope,
    state,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * 開啟 OAuth popup 視窗
 *
 * @param provider - Provider 名稱
 * @returns popup window reference（用於監測是否被關閉）
 */
export function openOAuthPopup(provider: string): Window | null {
  const url = getOAuthUrl(provider);
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  return window.open(
    url,
    "oauth-popup",
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`,
  );
}
