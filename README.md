# Factory × Strategy サンプルコード

[この記事](https://qiita.com/24kDct/items/dcf19dbace8d0f85c485)に載せたサンプルコード一式です。

## 収録ユースケース

- `src/userCrud` : User CRUD（Action で Strategy を切り替え）
- `src/userSearch` : 検索条件で呼ぶ API が変わる（Factory でパターン判定）
- `src/usersView` : 同一 API でも返却構造が変わる（Strategy で正規化）

## 実行（任意）

TypeScript をそのまま実行したい場合は、`tsx` を使うのが簡単です。

```bash
npm i
npm run demo:userCrud
npm run demo:userSearch
npm run demo:usersView
```
