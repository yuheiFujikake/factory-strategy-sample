import { UsersApiClient } from "./UsersApiClient";
import { UsersViewStrategyFactory } from "./UsersViewKit";
import { UsersViewController } from "./UsersViewController";
import {
  UsersCsvViewStrategy,
  UsersDetailViewStrategy,
  UsersSummaryViewStrategy,
} from "./UsersViewStrategies";

const api = new UsersApiClient();

const factory = new UsersViewStrategyFactory({
  summary: new UsersSummaryViewStrategy(api),
  detail: new UsersDetailViewStrategy(api),
  csv: new UsersCsvViewStrategy(api),
});

export const usersViewController = new UsersViewController(factory);

async function demo() {
  console.log(
    "summary:",
    await usersViewController.onFetch({ view: "summary", params: { page: 1 } })
  );
  console.log(
    "detail:",
    await usersViewController.onFetch({
      view: "detail",
      params: { includeRoles: true, page: 1 },
    })
  );
  console.log(
    "csv:",
    await usersViewController.onFetch({ view: "csv", params: { page: 1 } })
  );
}

demo().catch(console.error);
