import { SearchApiClient } from "./SearchApiClient";
import { UserSearchStrategyFactory } from "./UserSearchKit";
import { UserSearchController } from "./UserSearchController";
import {
  SearchAllStrategy,
  SearchByEmailStrategy,
  SearchByIdStrategy,
  SearchByKeywordStrategy,
} from "./UserSearchStrategies";

const api = new SearchApiClient();

const factory = new UserSearchStrategyFactory({
  ById: new SearchByIdStrategy(api),
  ByEmail: new SearchByEmailStrategy(api),
  ByKeyword: new SearchByKeywordStrategy(api),
  All: new SearchAllStrategy(api),
});

export const userSearchController = new UserSearchController(factory);

async function demo() {
  console.log("ById:", await userSearchController.onSearch({ id: "u100" }));
  console.log(
    "ByEmail:",
    await userSearchController.onSearch({ email: "a@b.com" })
  );
  console.log(
    "ByKeyword:",
    await userSearchController.onSearch({ keyword: "tokyo" })
  );
  console.log("All:", await userSearchController.onSearch({}));
}

demo().catch(console.error);
