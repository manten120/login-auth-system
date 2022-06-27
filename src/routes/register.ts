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

router.get('/', (req, res, _next) => {
  console.log(req.query.message)
  res.render('emailForm', { title: 'ユーザーアカウントを作成する画面', message: req.query.message});
});

router.post('/', async (req, res, _next) => {
  const email = req.body.emailAddress as string;
  const result = await createTempUserUseCase.execute(email);

  // 成功したら「メールを送信しました」
  res.redirect('/register/emailed');

  // 失敗したら「登録済みのメールアドレスです」
  // res.redirect('/register?message=登録済みのメールアドレスです');

  // エラーがおきたら?
});

router.get('/emailed', (_req, res, _next) => {
  res.render('message', { title: 'メールを送信しました', message: 'メールに記載した手順で登録手続きをすすめてください'});
});

router.get('/again', (_req, res, _next) => {
  res.render('emailForm', { title: 'ユーザーアカウントを作成する画面', });
});

router.get('/details', (req, res, _next) => {
  const { token } = req.query

  if (!token) {
    res.redirect('/register');
  }

  // tokenが有効かチェック
  
  

  // 有効ならばフォームを表示
  res.render('registerForm', { title: 'ユーザーアカウントを作成する画面', });

  // 無効(期限切れ)ならばその旨と/registerへのリンクを表示する

  // 無効(不正なtoken)ならば...?

  // エラーのときは...?
});

router.post('/details', (req, res, _next) => {

})

export { router as registerRouter };