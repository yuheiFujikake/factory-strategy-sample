/**
 * 検索条件に応じて別APIを叩く想定のクライアント。
 * - 実務では「最適化された検索API」が複数存在することがあります。
 */

export type UserDetailApiResponse = {
  id: string;
  name: string;
  email: string;
};

export type UserListApiResponse = {
  items: Array<{ id: string; name: string; email?: string }>;
  total: number;
};

export class SearchApiClient {
  async fetchUserById(id: string): Promise<UserDetailApiResponse> {
    // 例：GET /users/{id}
    return { id, name: "Taro", email: "taro@example.com" };
  }

  async searchUsersByEmail(
    email: string,
    page = 1
  ): Promise<UserListApiResponse> {
    // 例：GET /users/search/by-email?email=...&page=...
    return { items: [{ id: "u1", name: "Hanako", email }], total: 1 };
  }

  async searchUsersByKeyword(
    keyword: string,
    page = 1
  ): Promise<UserListApiResponse> {
    // 例：GET /users/search?keyword=...&page=...
    return { items: [{ id: "u2", name: `Matched:${keyword}` }], total: 1 };
  }

  async fetchUsers(page = 1): Promise<UserListApiResponse> {
    // 例：GET /users?page=...
    return { items: [{ id: "u3", name: "DefaultUser" }], total: 1 };
  }
}
