/**
 * OAuth 授權流程工具
 *
 * 依照指定 provider 建立 OAuth 2.0 授權 URL。
 * - 有 client_id 環境變數時導向真實 provider
 * - 沒有 client_id 時使用 mock callback，方便本機體驗登入流程
 *
 * 安全重點：
 * - CSRF 防護：以 crypto random 產生 state，並透過 sessionStorage 驗證
 * - Provider 白名單：只接受已設定的 OAuth provider
 *
 * @module lib/auth/oauth
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OAuthProviderConfig {
  /** OAuth provider 的授權端點 */
  authUrl: string;
  /** 要向 provider 申請的權限範圍 */
  scope: string;
  /** 存放 client_id 的環境變數 key（NEXT_PUBLIC_ prefix） */
  clientIdEnvKey: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** 存放 CSRF state 的 sessionStorage key */
const OAUTH_STATE_KEY = "oauth_state";

/** OAuth callback 等待完成的最長時間（毫秒） */
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

/** 允許使用的 OAuth provider 清單 */
export const SUPPORTED_PROVIDERS = Object.keys(PROVIDER_CONFIGS);

// ---------------------------------------------------------------------------
// CSRF State 管理
// ---------------------------------------------------------------------------

/**
 * 建立 CSRF state 並寫入 sessionStorage
 *
 * 使用 crypto.randomUUID() 產生不可預測的值，並限制在目前分頁內驗證。
 */
function createOAuthState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
}

/**
 * 驗證 CSRF state
 *
 * 比對 callback 帶回的 state 是否與本分頁儲存的值一致。
 * 驗證後會立即清除，確保 state 只能使用一次。
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
 * 檢查 provider 是否屬於允許的 OAuth provider
 */
export function isSupportedOAuthProvider(provider: string): boolean {
  return SUPPORTED_PROVIDERS.includes(provider.toLowerCase());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 建立 OAuth 授權 URL
 *
 * @param provider - Provider 名稱（Google / Facebook / LINE，不區分大小寫）
 * @returns 可導向的授權 URL
 *
 * @example
 * ```ts
 * const url = buildOAuthAuthorizationUrl("Google");
 * window.open(url, "oauth-popup", "width=500,height=600");
 * ```
 */
export function buildOAuthAuthorizationUrl(provider: string): string {
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
  const state = createOAuthState();

  // 無 client_id 時走 mock callback，保留完整 callback 流程
  if (!clientId) {
    const mockParams = new URLSearchParams({
      code: `mock-code-${key}-${Date.now()}`,
      state,
    });
    return `${redirectUri}?${mockParams.toString()}`;
  }

  // 有 client_id 時建立真實 OAuth provider 授權 URL
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
 * 開啟 OAuth 授權 popup 視窗
 *
 * @param provider - Provider 名稱
 * @returns popup window reference（可用於監測視窗是否關閉）
 */
export function openOAuthAuthorizationPopup(provider: string): Window | null {
  const url = buildOAuthAuthorizationUrl(provider);
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
