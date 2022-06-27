import express from 'express';
const router = express.Router();

// TODO:移動する
import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { CreateTempUserService } from '../domain/service/CreateTempUserService';
import { CreateTempUserUseCase } from '../useCase/CreateTempUserUseCase';
import { mailer } from '../infra/Mailer';
const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();
const createTempUserService = new CreateTempUserService(tempUserRepository, userRepository, mailer);
const createTempUserUseCase = new CreateTempUserUseCase(createTempUserService);

router.get('/', (_req, res, _next) => {
  res.send('ログイン後の画面, ユーザーアカウントの情報を表示する');
});

router.post('/create', (req, res, _next) => {
  res.redirect('/userAccount/register/emailed');
});

router.get('/register/emailed', (_req, res, _next) => {
  res.render('message', {
    title: 'ユーザーアカウントを仮登録しました',
    message:
      `登録されたメールアドレスに、登録を完了するための情報が記載されたメールをお送りしました。 メールの内容に従って登録を完了してください。`,
  });
});

router.get('/register/confirm', (_req, res, _next) => {
  res.render('message', {
    title: 'ユーザーアカウントを仮登録しました',
    message:
      `登録されたメールアドレスに、登録を完了するための情報が記載されたメールをお送りしました。 メールの内容に従って登録を完了してください。`,
  });
});

// router.get('/password', (_req, res, _next) => {
//   res.send('パスワード変更画面');
// });

// // patchメソッドのほうがいい?
// router.patch('/password', (_req, res, _next) => {
//   // パスワードを変更する処理

//   // 結果を返す
//   res.send('パスワード変更のための情報を受け取るエンドポイント');
// });

export { router as userRouter };
