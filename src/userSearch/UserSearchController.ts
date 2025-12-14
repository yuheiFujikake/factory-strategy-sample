import type { UserSearchForm, UserSearchResult } from "./UserSearchKit";
import { UserSearchStrategyFactory } from "./UserSearchKit";

/**
 * 検索Controller。
 * - formを受け取る
 * - Factoryがパターン判定してStrategyを返す
 * - Strategyを実行する
 */
export class UserSearchController {
  constructor(private readonly factory: UserSearchStrategyFactory) {}

  async onSearch(form: UserSearchForm): Promise<UserSearchResult> {
    const strategy = this.factory.create(form);
    return await strategy.execute(form);
  }
}
