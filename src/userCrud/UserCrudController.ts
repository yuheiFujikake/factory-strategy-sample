import type { UserCrudInput } from "./UserCrudKit";
import { UserCrudStrategyFactory } from "./UserCrudKit";

/**
 * Controllerの責務：
 * - 入力を受け取る
 * - FactoryでStrategyを選ぶ
 * - Strategyを実行する
 * - 結果を返す
 *
 * ここに検証やAPIを入れ始めると、分岐が戻りやすいです。
 */
export class UserCrudController {
  constructor(private readonly factory: UserCrudStrategyFactory) {}

  async onSubmit(input: UserCrudInput) {
    const strategy = this.factory.create(input.action);
    return await strategy.execute(input);
  }
}
