/**
 * Users表示ユースケースのKit。
 * - viewによって返却構造が変わるケースを想定します。
 */

export type UsersViewMode = "summary" | "detail" | "csv";

export type UsersViewParams = {
  page?: number;
  includeRoles?: boolean;
};

export type UsersViewInput = {
  view: UsersViewMode;
  params?: UsersViewParams;
};

/**
 * UIが扱いやすい共通結果（正規化後）。
 * - table: 一覧表示
 * - csv: CSV文字列
 */
export type UsersViewResult =
  | {
      kind: "table";
      rows: Array<{
        id: string;
        name: string;
        email?: string;
        roles?: string[];
      }>;
      total?: number;
    }
  | { kind: "csv"; csvText: string };

export interface UsersViewStrategy {
  execute(input: UsersViewInput): Promise<UsersViewResult>;
}

type StrategyMap = Record<UsersViewMode, UsersViewStrategy>;

/** Factory：viewに応じてStrategyを返す（選択だけ） */
export class UsersViewStrategyFactory {
  constructor(private readonly map: StrategyMap) {}

  create(view: UsersViewMode): UsersViewStrategy {
    const strategy = this.map[view];
    if (!strategy) throw new Error(`Unsupported view: ${view}`);
    return strategy;
  }
}
