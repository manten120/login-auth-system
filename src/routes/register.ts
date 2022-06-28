import express from 'express';
const router = express.Router();

// TODO:移動する
import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { CreateTempUserUseCase } from '../useCase/CreateTempUserUseCase';
import { mailer } from '../infra/Mailer';
import { Email } from '../domain/user/Email';
import { UrlToken } from '../domain/tempUser/UrlToken';
import { CheckUrlTokenUseCase } from '../useCase/CheckUrlTokenUseCase';
import { CreateUserUseCase } from '../useCase/CreateUserUseCase';
const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();
const createTempUserUseCase = new CreateTempUserUseCase(userRepository, tempUserRepository, mailer);
const checkUrlTokenUseCase = new CheckUrlTokenUseCase(tempUserRepository);
const createUserUseCase = new CreateUserUseCase(tempUserRepository, userRepository)

// ユーザーアカウント作成を開始する
router.get('/', (req, res, _next) => {
  res.render('emailForm', { title: 'ユーザーアカウントを作成する画面1', message: req.query.message });
});

router.post('/', async (req, res, _next) => {
  const email = req.body.email;

  // 明らかにEメールアドレスではない値がPOSTされたとき
  if (typeof email !== 'string' || !Email.isValid(email)) {
    return res.redirect('/register');
  }

  const result = await createTempUserUseCase.execute(email);

  // 仮登録ユーザーを作成できたとき
  if (result.ok) {
    // 登録手続きを進めるためのEメールを送信したことを表示する
    return res.redirect('/register/emailed');
  }

  // Eメールアドレスが登録済みのとき
  if (result.reason === 'userAlreadyRegistered') {
    return res.redirect('/register?message=登録済みのメールアドレスです');
  }

  // Eメールアドレス登録を過度に繰り返すとき
  if (result.reason === 'exceeded') {
    return res.redirect('/register?message=しばらく時間をおいてから試してください');
  }

  // 明らかにEメールアドレスではない文字列がPOSTされたとき
  if (result.reason === 'sendingEmailFailed') {
    return res.redirect('/register?message=正しいメールアドレスを入力してください');
  }

  return res.redirect('/register?message=予期せぬエラー。申し訳ありません。しばらく時間をおいてから試してください。');
});

router.get('/emailed', (_req, res, _next) => {
  res.render('message', {
    title: 'メールを送信しました',
    message: 'メールに記載した手順で登録手続きをすすめてください',
  });
});

// TODO: メールを再送する
// router.post('/emailed', (req, res, _next) => {});

router.get('/details', async (req, res, _next) => {
  const urlToken = req.query.t;

  // urlTokenがundefinedまたはurlTokenのフォーマットがuuidでないとき
  // 
  if (typeof urlToken !== 'string' || !UrlToken.isUUID(urlToken)) {
    return res.redirect('/register?message=無効なURLです。最初からやり直してください。');
  }

  // urlTokenが有効かチェック
  const result = await checkUrlTokenUseCase.execute(urlToken);

  // 有効ならばフォームを表示
  if (result.ok) {
    return res.render('registerForm', { title: 'ユーザーアカウントを作成する画面', urlToken });
  }

  // 無効(期限切れ)ならばその旨とEメールアドレス登録フォームを表示する
  if (result.reason === 'expired') {
    return res.redirect('/register?message=期限切れです。最初からやり直してください。');
  }

  // 無効ならばその旨とEメールアドレス登録フォームを表示する
  // urlTokenと紐づく仮登録ユーザーが存在しないとき
  if (result.reason === 'notExist') {
    return res.redirect('/register?message=無効なURLです。最初からやり直してください。');
  }

  return res.redirect('/register?message=予期せぬエラー。申し訳ありません。しばらく時間をおいてから試してください。');
});

const removeSlash = (urlToken: any) => {
  if (typeof urlToken !== 'string') {
    return urlToken;
  }
  const end = urlToken.slice(-1);
  if (end === '/') {
    return urlToken.slice(0, -1);
  }
  return urlToken;
};

// 
router.post('/details', async (req, res, _next) => {
  const { name, password1, password2 } = req.body;

  // urlTokenの末尾になぜか/がついてしまうので削除する
  const urlToken = removeSlash(req.body.urlToken);

  console.log('typeof...', typeof name)
  console.log({ name, password1, password2 })

  if (
    typeof name !== 'string' &&
    typeof password1 !== 'string' &&
    typeof password2 !== 'string' &&
    typeof urlToken !== 'string'
  ) {
    // エラー
  }

  const result = await createUserUseCase.execute({ userNameValue: name, urlTokenValue: urlToken, password1, password2 });

  if (result.ok) {
    return
  }

  // 期限切れのとき
  if (result.reason === 'expired') {
    return res.redirect('/register?message=期限切れです。最初からやり直してください。');
  }
});

export { router as registerRouter };
