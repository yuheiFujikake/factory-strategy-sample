/**
 * 検索ユースケースのKit。
 * - form入力から「検索パターン」を決めるのがFactoryの仕事です。
 */

export type UserSearchForm = {
  id?: string;
  email?: string;
  keyword?: string;
  page?: number;
};

export type UserSearchResult = {
  items: Array<{ id: string; name: string; email?: string }>;
  total?: number;
};

export interface UserSearchStrategy {
  execute(form: UserSearchForm): Promise<UserSearchResult>;
}

/** Factory内部で使うパターンキー（UIへ漏らさなくてOK） */
export type SearchPattern = "ById" | "ByEmail" | "ByKeyword" | "All";

type StrategyMap = Record<SearchPattern, UserSearchStrategy>;

export class UserSearchStrategyFactory {
  constructor(private readonly map: StrategyMap) {}

  /**
   * formから検索パターンを判定します。
   * - ここに「優先順位」を閉じます。
   * - 実務では仕様になりやすいので、1か所にまとめる価値が高いです。
   */
  private detectPattern(form: UserSearchForm): SearchPattern {
    if (form.id && form.id.trim().length > 0) return "ById";
    if (form.email && form.email.trim().length > 0) return "ByEmail";
    if (form.keyword && form.keyword.trim().length > 0) return "ByKeyword";
    return "All";
  }

  /** formを受けて、対応するStrategyを返します */
  create(form: UserSearchForm): UserSearchStrategy {
    const pattern = this.detectPattern(form);
    const strategy = this.map[pattern];
    if (!strategy) throw new Error(`Unsupported pattern: ${pattern}`);
    return strategy;
  }
}
