import { ApiClient } from "./ApiClient";
import { UserCrudStrategyFactory } from "./UserCrudKit";
import { UserCrudController } from "./UserCrudController";
import {
  CreateUserStrategy,
  DeleteUserStrategy,
  UpdateUserStrategy,
} from "./UserCrudStrategies";

/**
 * 依存の組み立て（Composition Root）をここに寄せます。
 * - Strategyの差し替えやテスト用差し替えがしやすくなります。
 */

const api = new ApiClient();

const factory = new UserCrudStrategyFactory({
  CreateUser: new CreateUserStrategy(api),
  UpdateUser: new UpdateUserStrategy(api),
  DeleteUser: new DeleteUserStrategy(api),
});

export const userCrudController = new UserCrudController(factory);

/** 動作例 */
async function demo() {
  const res = await userCrudController.onSubmit({
    action: "CreateUser",
    payload: { name: "Taro", email: "taro@example.com" },
  });

  console.log("nextRoute:", res.nextRoute);
}

demo().catch(console.error);
