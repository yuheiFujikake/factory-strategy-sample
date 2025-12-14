import type { UsersViewInput, UsersViewResult } from "./UsersViewKit";
import { UsersViewStrategyFactory } from "./UsersViewKit";

/**
 * view差分Controller。
 * - viewを受け取る
 * - FactoryでStrategyを選ぶ
 * - Strategyを実行する
 */
export class UsersViewController {
  constructor(private readonly factory: UsersViewStrategyFactory) {}

  async onFetch(input: UsersViewInput): Promise<UsersViewResult> {
    const strategy = this.factory.create(input.view);
    return await strategy.execute(input);
  }
}
