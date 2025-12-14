/**
 * User CRUD ユースケースの “Kit”。
 * - Types（入力/出力/StrategyI/F）とFactoryを同居させます。
 * - ユースケース単位で閉じることで、影響範囲を小さくします。
 */

/** このユースケースで扱うAction（追加したらFactoryのmapにも登録します） */
export type UserCrudAction = "CreateUser" | "UpdateUser" | "DeleteUser";

/**
 * Controller -> Strategy へ渡す入力。
 * - payloadはunknownにします。
 * - 理由：画面入力は不確定要素が多いので、Strategy側で検証して安全にします。
 */
export type UserCrudInput = {
  action: UserCrudAction;
  payload: unknown;
};

/** Strategyが返す結果（例：次の画面） */
export type UserCrudResult = {
  nextRoute: string;
};

/** すべてのCRUD Strategyが実装する共通I/F */
export interface UserCrudStrategy {
  execute(input: UserCrudInput): Promise<UserCrudResult>;
}

/** Action -> Strategy の対応表（登録漏れを検出しやすい） */
type StrategyMap = Record<UserCrudAction, UserCrudStrategy>;

/**
 * Factoryの責務：
 * - 「どのStrategyを使うか」だけを担当します。
 * - ここに検証やAPI呼び出しを入れないのが重要です。
 */
export class UserCrudStrategyFactory {
  constructor(private readonly map: StrategyMap) {}

  /** Actionを受けて、対応するStrategyを返します */
  create(action: UserCrudAction): UserCrudStrategy {
    const strategy = this.map[action];

    // 登録漏れは早めに例外で気づけるようにします。
    if (!strategy) throw new Error(`Unsupported action: ${action}`);

    return strategy;
  }
}
