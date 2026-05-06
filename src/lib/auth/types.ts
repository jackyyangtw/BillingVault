/**
 * 認證模組類型定義
 *
 * 定義所有認證相關的 TypeScript 類型，
 * 包括用戶資料、表單狀態和 API 回傳格式。
 */

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

/** 前端 UI 使用的用戶資料（非敏感） */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// ---------------------------------------------------------------------------
// Server Action Results
// ---------------------------------------------------------------------------

/** login Server Action 的回傳結果 */
export type LoginActionResult =
  | { success: true; user: UserProfile }
  | { success: false; message: string };

/** register Server Action 的回傳結果 */
export type RegisterActionResult =
  | { success: true; user: UserProfile }
  | { success: false; message: string };

// ---------------------------------------------------------------------------
// API Response（後端 API 的回傳介面，先定義好方便未來對接）
// ---------------------------------------------------------------------------

/** 後端登入 API 的回傳格式 */
export interface AuthApiResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
  /** 第三方登入時，標記此用戶是否已完成註冊 */
  isRegistered?: boolean;
}
