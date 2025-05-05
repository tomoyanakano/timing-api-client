import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API エラーの詳細情報
 */
export interface ApiErrorDetail {
  /**
   * HTTPステータスコード
   */
  status: number;

  /**
   * エラーメッセージ
   */
  message: string;

  /**
   * エラーコード（APIから返された場合）
   */
  code?: string;

  /**
   * 元のAxiosエラー
   */
  originalError: AxiosError;
}

/**
 * API リクエストエラー
 */
export class ApiError extends Error {
  /**
   * HTTPステータスコード
   */
  public readonly status: number;

  /**
   * エラーコード（APIから返された場合）
   */
  public readonly code?: string;

  /**
   * 元のAxiosエラー
   */
  public readonly originalError: AxiosError;

  constructor(details: ApiErrorDetail) {
    super(details.message);
    this.name = 'ApiError';
    this.status = details.status;
    this.code = details.code;
    this.originalError = details.originalError;

    // エラーメッセージの一部をエラースタックに追加する
    if (details.originalError.response?.data?.error) {
      this.message = `${this.message}: ${details.originalError.response.data.error}`;
    }

    // プロトタイプチェーンの修復 (TypeScriptのクラス継承用)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * API リクエストを実行し、レスポンスを処理する
 * @param axiosInstance Axiosインスタンス
 * @param config リクエスト設定
 * @returns レスポンスデータ
 * @throws ApiError リクエストエラーの場合
 */
export async function performRequest<T>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status || 500;
      const errorData = axiosError.response?.data as any;
      const errorMessage = errorData?.error || errorData?.message || axiosError.message || '不明なエラーが発生しました';
      const errorCode = errorData?.code;

      throw new ApiError({
        status: statusCode,
        message: errorMessage,
        code: errorCode,
        originalError: axiosError
      });
    }

    // Axiosエラーでない場合は、そのままスローする
    throw error;
  }
