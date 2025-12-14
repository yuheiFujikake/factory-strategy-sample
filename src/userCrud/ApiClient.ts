/**
 * API呼び出し層の “形” だけ置きます。
 * - 実務ではfetch/axios等でHTTP通信します。
 * - StrategyはHTTPの詳細を知らずに済むよう、ApiClientへ委譲します。
 */

export type ApiResponse = {
  ok: boolean;
  message?: string;
};

export class ApiClient {
  async post(path: string, body: unknown): Promise<ApiResponse> {
    // デモ用：常に成功にしています。
    // 実務では path と body を使ってHTTPリクエストし、結果を返します。
    return { ok: true };
  }
}
