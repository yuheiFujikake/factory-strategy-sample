import type { UserCrudInput, UserCrudStrategy } from "./UserCrudKit";
import { ApiClient } from "./ApiClient";

/**
 * User CRUDのStrategy群を1ファイルに集約します。
 * - Create/Update/Deleteの処理の中身（検証・API・結果組み立て）をここへ閉じます。
 * - Controllerは「どれを呼ぶか」しか知らない状態にします。
 */

/** payloadの期待形（ここで定義しておくと、探索が速くなります） */
type CreateUserPayload = { name: string; email: string };
type UpdateUserPayload = { id: string; name?: string; email?: string };
type DeleteUserPayload = { id: string };

/** unknownを扱うための小さなヘルパー（外部ライブラリ無しで最低限） */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function assertNonEmptyString(v: unknown, field: string): asserts v is string {
  if (typeof v !== "string" || v.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
}

/** Create用payloadの検証と変換（unknown -> CreateUserPayload） */
function parseCreatePayload(payload: unknown): CreateUserPayload {
  if (!isObject(payload)) throw new Error("payload must be an object");

  const name = payload["name"];
  const email = payload["email"];

  assertNonEmptyString(name, "name");
  assertNonEmptyString(email, "email");

  return { name, email };
}

/** Update用payloadの検証と変換（unknown -> UpdateUserPayload） */
function parseUpdatePayload(payload: unknown): UpdateUserPayload {
  if (!isObject(payload)) throw new Error("payload must be an object");

  const id = payload["id"];
  assertNonEmptyString(id, "id");

  const name = payload["name"];
  const email = payload["email"];

  // optionalは「入っていたら型チェック」だけします。
  if (name !== undefined && typeof name !== "string")
    throw new Error("name must be string");
  if (email !== undefined && typeof email !== "string")
    throw new Error("email must be string");

  return {
    id,
    name: name as string | undefined,
    email: email as string | undefined,
  };
}

/** Delete用payloadの検証と変換（unknown -> DeleteUserPayload） */
function parseDeletePayload(payload: unknown): DeleteUserPayload {
  if (!isObject(payload)) throw new Error("payload must be an object");

  const id = payload["id"];
  assertNonEmptyString(id, "id");

  return { id };
}

/** CreateUserのStrategy：検証 -> API -> 結果 */
export class CreateUserStrategy implements UserCrudStrategy {
  constructor(private readonly api: ApiClient) {}

  async execute(input: UserCrudInput) {
    // Factoryが正しく選ぶ前提でも、誤配線に備えて守ります。
    if (input.action !== "CreateUser") {
      throw new Error(
        `CreateUserStrategy does not support action: ${input.action}`
      );
    }

    // unknown -> 期待形へ（ここが安全装置）
    const { name, email } = parseCreatePayload(input.payload);

    // API呼び出し（実務ではPOST /users等）
    const res = await this.api.post("/users", { name, email });

    // 失敗時の扱い（ここでは例外で単純化）
    if (!res.ok) throw new Error(res.message ?? "create failed");

    // 成功時は一覧へ戻る想定
    return { nextRoute: "/users" };
  }
}

/** UpdateUserのStrategy */
export class UpdateUserStrategy implements UserCrudStrategy {
  constructor(private readonly api: ApiClient) {}

  async execute(input: UserCrudInput) {
    if (input.action !== "UpdateUser") {
      throw new Error(
        `UpdateUserStrategy does not support action: ${input.action}`
      );
    }

    const { id, name, email } = parseUpdatePayload(input.payload);

    // 実務ではPUT/PATCHを使うこともあります（ここではpostで簡略化）
    const res = await this.api.post(`/users/${id}`, { name, email });
    if (!res.ok) throw new Error(res.message ?? "update failed");

    // 成功時は詳細へ
    return { nextRoute: `/users/${id}` };
  }
}

/** DeleteUserのStrategy */
export class DeleteUserStrategy implements UserCrudStrategy {
  constructor(private readonly api: ApiClient) {}

  async execute(input: UserCrudInput) {
    if (input.action !== "DeleteUser") {
      throw new Error(
        `DeleteUserStrategy does not support action: ${input.action}`
      );
    }

    const { id } = parseDeletePayload(input.payload);

    const res = await this.api.post(`/users/${id}/delete`, {});
    if (!res.ok) throw new Error(res.message ?? "delete failed");

    // 成功時は一覧へ
    return { nextRoute: "/users" };
  }
}
