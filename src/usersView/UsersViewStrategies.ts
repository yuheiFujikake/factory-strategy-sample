import type {
  UsersViewInput,
  UsersViewResult,
  UsersViewStrategy,
} from "./UsersViewKit";
import { UsersApiClient } from "./UsersApiClient";

/**
 * view差分を吸収するStrategy群。
 * - 返却構造の違いをUIへ漏らさないのが主目的です。
 */

export class UsersSummaryViewStrategy implements UsersViewStrategy {
  constructor(private readonly api: UsersApiClient) {}

  async execute(input: UsersViewInput): Promise<UsersViewResult> {
    if (input.view !== "summary")
      throw new Error(
        `UsersSummaryViewStrategy does not support view: ${input.view}`
      );

    const res = await this.api.fetchUsers("summary", {
      page: input.params?.page ?? 1,
    });

    // summary形 -> 共通table形へ正規化
    return {
      kind: "table",
      rows: res.items.map((x) => ({ id: x.id, name: x.name, email: x.email })),
      total: res.total,
    };
  }
}

export class UsersDetailViewStrategy implements UsersViewStrategy {
  constructor(private readonly api: UsersApiClient) {}

  async execute(input: UsersViewInput): Promise<UsersViewResult> {
    if (input.view !== "detail")
      throw new Error(
        `UsersDetailViewStrategy does not support view: ${input.view}`
      );

    const includeRoles = input.params?.includeRoles ?? false;

    const res = await this.api.fetchUsers("detail", {
      page: input.params?.page ?? 1,
      includeRoles,
    });

    // detail形（ネストあり） -> 共通table形へ正規化
    return {
      kind: "table",
      rows: res.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.profile.email, // ネスト差分はここで吸収
        roles: includeRoles ? u.roles : undefined, // UIに条件分岐を漏らしにくくする
      })),
      total: res.total,
    };
  }
}

export class UsersCsvViewStrategy implements UsersViewStrategy {
  constructor(private readonly api: UsersApiClient) {}

  async execute(input: UsersViewInput): Promise<UsersViewResult> {
    if (input.view !== "csv")
      throw new Error(
        `UsersCsvViewStrategy does not support view: ${input.view}`
      );

    const res = await this.api.fetchUsers("csv", {
      page: input.params?.page ?? 1,
    });

    // csvはtableにせず、csvとして返します（UIはkindで描画を切り替える）
    return { kind: "csv", csvText: res.csvText };
  }
}
