# login-auth-system

# 実装したが理解できていない箇所

- データベースはMySQLを使用。他のデータベースとの違いは理解できていません。

- [src/adapter/encrypt.ts] 暗号化の仕組みやアルゴリズム

- [src/session.ts] express-sessionの設定項目。セッションの有効期限の適切な値。

- 

# 起動方法

本番環境

```
docker-compose -f prod.docker-compose.yml up -d
```

開発環境

```
docker-compose up -d
```
