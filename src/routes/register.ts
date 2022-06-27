import express from 'express';
const router = express.Router();

// TODO:移動する
import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { CreateTempUserUseCase } from '../useCase/CreateTempUserUseCase';
import { mailer } from '../infra/Mailer';
import { Email } from '../domain/user/Email';
const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();
const createTempUserUseCase = new CreateTempUserUseCase(userRepository, tempUserRepository, mailer);

router.get('/', (req, res, _next) => {
  res.render('emailForm', { title: 'ユーザーアカウントを作成する画面', message: req.query.message });
});

router.post('/', async (req, res, _next) => {
  const email = req.body.email as string;

  if (!Email.isValid(email)) {
    return res.redirect('/register');
  }

  const result = await createTempUserUseCase.execute(email);

  if (result.ok) {
    return res.redirect('/register/emailed');
  }

  if (result.reason === 'alreadyRegistered') {
    return res.redirect('/register?message=登録済みのメールアドレスです');
  }

  if (result.reason === 'exceeded') {
    return res.redirect('/register?message=しばらく時間をおいてから試してください');
  }

  if (result.reason === 'emailFailed') {
    return res.redirect('/register?message=正しいメールアドレスを入力してください');
  }
});

router.get('/emailed', (_req, res, _next) => {
  res.render('message', {
    title: 'メールを送信しました',
    message: 'メールに記載した手順で登録手続きをすすめてください',
  });
});

router.post('/emailed', (req, res, _next) => {});

router.get('/details', (req, res, _next) => {
  const { token } = req.query;

  if (!token) {
    res.redirect('/register');
  }

  // tokenが有効かチェック

  // 有効ならばフォームを表示
  res.render('registerForm', { title: 'ユーザーアカウントを作成する画面' });

  // 無効(期限切れ)ならばその旨と/registerへのリンクを表示する

  // 無効(不正なtoken)ならば...?

  // エラーのときは...?
});

router.post('/details', (req, res, _next) => {});

export { router as registerRouter };
