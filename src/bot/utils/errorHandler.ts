// エラーハンドリング用ユーティリティ

export interface ErrorContext {
  operation: string;
  details?: any;
  timestamp: string;
}

export class ErrorHandler {
  /**
   * エラーをログ出力し、適切なエラーメッセージを返す
   */
  static handleError(error: any, context: Partial<ErrorContext> = {}): string {
    const errorContext: ErrorContext = {
      operation: context.operation || 'Unknown operation',
      details: context.details,
      timestamp: new Date().toISOString()
    };

    this.logError(error, errorContext);
    return this.getErrorMessage(error);
  }

  /**
   * エラーをログ出力する
   */
  private static logError(error: any, context: ErrorContext): void {
    console.error('=== エラー発生 ===');
    console.error('操作:', context.operation);
    console.error('タイムスタンプ:', context.timestamp);
    console.error('エラー詳細:', context.details);
    console.error('エラーオブジェクト:', error);
    
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
  }

  /**
   * エラータイプに応じたメッセージを取得する
   */
  private static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return '予期しないエラーが発生しました';
  }

  /**
   * 非同期処理のエラーハンドリング
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext> = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = this.handleError(error, context);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 同期処理のエラーハンドリング
   */
  static withSyncErrorHandling<T>(
    operation: () => T,
    context: Partial<ErrorContext> = {}
  ): { success: boolean; data?: T; error?: string } {
    try {
      const result = operation();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = this.handleError(error, context);
      return { success: false, error: errorMessage };
    }
  }
} 