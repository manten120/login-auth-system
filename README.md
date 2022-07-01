# 提出課題

# 実装したが理解できていない箇所

### データベースはMySQLを使用。
- 他のデータベースとの違いは理解できていません。
- ルートユーザーで接続しているので修正しないといけないかもしれません

### [src/adapter/encrypt.ts] 
- 暗号化の仕組みやアルゴリズムをほとんど理解せず書いています

### [src/session.ts]
- express-sessionの設定項目

### [src/domain/userUserName.ts と routes/validation.ts]
- ユーザー名のバリデーションを2箇所に書いているのは、よくないかもしれません。
- Eメールアドレスとパスワードについても同じです。

### [src/domain/~ , src/useCase/~ src/routes/~]
- エラーハンドリングをどのように書くのがよいかわかっていません。

### [src/infra/db/initDB.ts]
- usersテーブル(UserModel)のidを、forgotten-usersテーブル(ForgottenUserModel)の外部キーにして、1対1に関連付けています。
- そのためにsequelizeのbelongsToメソッドを使っていますが、hasOneメソッドとの違いは理解していません。


# 起動方法

本番環境

```
docker-compose -f prod.docker-compose.yml up -d
```

開発環境

```
docker-compose up -d
```

ともにブラウザで http://localhost:8000 にアクセスしてください


起動に失敗した場合

```
docker restart node16
```

# 機能 1-4

パスワードを忘れた場合の仕様
- ユーザーアカウント登録時にEメールアドレスを登録します
- パスワードを忘れた場合、Eメールアドレスを入力してもらいます
- このEメールアドレスに該当するユーザーが存在する場合、パスワード変更画面のURLを記載したメールを送信します
- 30分以内にパスワード変更画面での手続きを完了しないと、Eメールアドレスの入力からやり直しになります
- メールアドレスの入力を10回繰り返した場合、0時0分まで再入力不可になります
