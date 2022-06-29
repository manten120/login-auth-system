import express from 'express';
import { Email } from '../domain/user/Email';
import { UrlToken } from '../domain/tempUser/UrlToken';
import { createTempUserUseCase, checkUrlTokenUseCase, createUserUseCase } from '../useCase/init';

const router = express.Router();

// ユーザーアカウント作成を開始する
router.get('/', (req, res, next) => {
  res.render('emailForm', { title: 'ユーザーアカウントを作成する画面1', message: req.query.message });
});

router.post('/', async (req, res, next) => {
  (async () => {
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

    // 登録手続きメールの送信に失敗した時
    // 明らかにEメールアドレスではない文字列がPOSTされたとき
    if (result.reason === 'sendingEmailFailed') {
      return res.redirect(
        '/register?message=メールの送信に失敗しました。申し訳ありません。しばらく時間をおいてから試してください。'
      );
    }

    // TODO: この辺の処理
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

router.get('/emailed', (_req, res, _next) => {
  res.render('message', {
    title: 'メールを送信しました',
    message: 'メールに記載した手順で登録手続きをすすめてください',
  });
});

// 登録手続きメールからアクセスしたとき
router.get('/details', async (req, res, next) => {
  (async () => {
    const urlToken = req.query.t;

    // TODO: 削除
    if (typeof urlToken !== 'string') {
      console.log('not string');
    }

    // urlTokenがundefinedまたはurlTokenのフォーマットがuuidでないとき
    if (typeof urlToken !== 'string' || !UrlToken.isUUID(urlToken)) {
      return res.redirect('/register?message=無効なURLです。最初からやり直してください。');
    }

    // urlTokenが有効かチェック
    const result = await checkUrlTokenUseCase.execute(urlToken);

    // 有効ならばフォームを表示
    if (result.ok) {
      return res.render('registerForm', {
        title: 'ユーザーアカウントを作成する画面2',
        urlToken,
        message: req.query.message,
      });
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

    // TODO: この辺の処理
    // return res.redirect('/register?message=予期せぬエラー。申し訳ありません。しばらく時間をおいてから試してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
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
router.post('/details', async (req, res, next) => {
  (async () => {
    const { name, password1, password2 } = req.body;

    // urlTokenの末尾になぜか/がついてしまうので削除する
    const urlToken = removeSlash(req.body.urlToken);

    if (
      typeof name !== 'string' &&
      typeof password1 !== 'string' &&
      typeof password2 !== 'string' &&
      typeof urlToken !== 'string'
    ) {
      // TODO: この辺の処理
      // エラー
    }

    const result = await createUserUseCase.execute({
      userNameValue: name,
      urlTokenValue: urlToken,
      password1,
      password2,
    });

    if (result.ok) {
      req.session.loggedIn = true;
      req.session.userName = name;
      res.redirect('/user'); // res.send()だとセッションが保存されない
      return;
    }

    // 期限切れのとき
    if (result.reason === 'expired') {
      return res.redirect('/register?message=期限切れです。最初からやり直してください。');
    }

    // TODO: この辺の処理
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect(
        `/register/details?message=申し訳ありません。しばらく時間をおいてから試してください。&t=${req.body.urlToken}`
      );
    }
    next(e);
  });
});

export { router as registerRouter };
