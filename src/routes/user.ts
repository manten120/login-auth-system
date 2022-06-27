import express from 'express';
const router = express.Router();

// TODO:移動する
import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { CreateTempUserUseCase } from '../useCase/CreateTempUserUseCase';
import { mailer } from '../infra/Mailer';
const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();
const createTempUserUseCase = new CreateTempUserUseCase(userRepository, tempUserRepository, mailer);

router.get('/', (_req, res, _next) => {
  res.send('ログイン後の画面, ユーザーアカウントの情報を表示する');
});

// router.get('/edit', (_req, res, _next) => {
//   res.send('パスワード変更画面');
// });

// // patchメソッドのほうがいい?
// router.patch('/edit', (_req, res, _next) => {
//   // パスワードを変更する処理

//   // 結果を返す
//   res.send('パスワード変更のための情報を受け取るエンドポイント');
// });

export { router as userRouter };
