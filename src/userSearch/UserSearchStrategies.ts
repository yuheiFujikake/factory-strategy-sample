import type {
  UserSearchForm,
  UserSearchResult,
  UserSearchStrategy,
} from "./UserSearchKit";
import { SearchApiClient } from "./SearchApiClient";

/**
 * 検索ユースケースのStrategy群。
 * - UIやControllerに「APIの違い」を漏らさず、ここに閉じます。
 */

function assertNonEmptyString(v: unknown, field: string): asserts v is string {
  if (typeof v !== "string" || v.trim().length === 0)
    throw new Error(`${field} is required`);
}

/** ID検索：詳細API -> 一覧表示用に正規化 */
export class SearchByIdStrategy implements UserSearchStrategy {
  constructor(private readonly api: SearchApiClient) {}

  async execute(form: UserSearchForm): Promise<UserSearchResult> {
    assertNonEmptyString(form.id, "id");

    const user = await this.api.fetchUserById(form.id);

    // 詳細を items へ変換して返す（UIはitemsだけ扱えばよい）
    return {
      items: [{ id: user.id, name: user.name, email: user.email }],
      total: 1,
    };
  }
}

/** Email検索 */
export class SearchByEmailStrategy implements UserSearchStrategy {
  constructor(private readonly api: SearchApiClient) {}

  async execute(form: UserSearchForm): Promise<UserSearchResult> {
    assertNonEmptyString(form.email, "email");

    const page = form.page ?? 1;
    const res = await this.api.searchUsersByEmail(form.email, page);

    return { items: res.items, total: res.total };
  }
}

/** Keyword検索 */
export class SearchByKeywordStrategy implements UserSearchStrategy {
  constructor(private readonly api: SearchApiClient) {}

  async execute(form: UserSearchForm): Promise<UserSearchResult> {
    assertNonEmptyString(form.keyword, "keyword");

    const page = form.page ?? 1;
    const res = await this.api.searchUsersByKeyword(form.keyword, page);

    return { items: res.items, total: res.total };
  }
}

/** 条件なし：一覧 */
export class SearchAllStrategy implements UserSearchStrategy {
  constructor(private readonly api: SearchApiClient) {}

  async execute(form: UserSearchForm): Promise<UserSearchResult> {
    const page = form.page ?? 1;
    const res = await this.api.fetchUsers(page);

    return { items: res.items, total: res.total };
  }
}
