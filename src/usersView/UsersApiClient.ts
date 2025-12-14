import type { UsersViewMode } from "./UsersViewKit";

/**
 * 同じAPIを叩くが、viewによって返却形が変わる想定のクライアント。
 * - summary: items
 * - detail: users + profileネスト + roles
 * - csv: csvText
 */

export type UsersSummaryResponse = {
  items: Array<{ id: string; name: string; email?: string }>;
  total: number;
};

export type UsersDetailResponse = {
  users: Array<{
    id: string;
    name: string;
    profile: { email: string };
    roles: string[];
  }>;
  total: number;
};

export type UsersCsvResponse = {
  csvText: string;
};

export class UsersApiClient {
  async fetchUsers(
    view: "summary",
    params?: { page?: number }
  ): Promise<UsersSummaryResponse>;
  async fetchUsers(
    view: "detail",
    params?: { includeRoles?: boolean; page?: number }
  ): Promise<UsersDetailResponse>;
  async fetchUsers(
    view: "csv",
    params?: { page?: number }
  ): Promise<UsersCsvResponse>;
  async fetchUsers(view: UsersViewMode, params?: any): Promise<any> {
    // デモ用：viewで返却形を変えます。
    if (view === "summary") {
      return {
        items: [{ id: "u1", name: "Taro", email: "taro@example.com" }],
        total: 1,
      };
    }

    if (view === "detail") {
      const includeRoles = Boolean(params?.includeRoles);
      return {
        users: [
          {
            id: "u1",
            name: "Taro",
            profile: { email: "taro@example.com" },
            roles: includeRoles ? ["admin"] : [],
          },
        ],
        total: 1,
      };
    }

    if (view === "csv") {
      return { csvText: "id,name,email\nu1,Taro,taro@example.com\n" };
    }

    throw new Error("Unsupported view");
  }
}
