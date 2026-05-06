/**
 * Mock for "server-only" package
 *
 * "server-only" 在 Next.js 中會在 client 端 import 時拋錯，
 * 但在 Vitest 測試環境中不需要此限制，因此提供空 mock。
 */
export {};
