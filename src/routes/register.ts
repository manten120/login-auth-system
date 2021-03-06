import express from 'express';
import { registerTempUserUseCase, checkUrlTokenUseCase, registerUserUseCase } from '../useCase/init';
import { csrfProtection } from '../adapter/csrfProtection';
import { emailIsValid, passwordIdValid, urlTokenIsValid, userNameIsValid } from './validation';

const router = express.Router();

// ユーザーアカウント登録を開始する
router.get('/', csrfProtection, (req, res, _next) => {
  res.render('emailForm', {
    title: 'ユーザーアカウント登録画面1',
    message: req.query.message,
    type: 'registerUser',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
    csrfToken: req.csrfToken(),
  });
});

router.post('/', csrfProtection, async (req, res, next) => {
  (async () => {
    const email = req.body.email;

    if (!emailIsValid(email)) {
      return res.redirect('/register');
    }

    const result = await registerTempUserUseCase.execute(email);

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

    return res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

// 登録手続きメールを送信した旨を表示する
router.get('/emailed', (req, res, _next) => {
  res.render('message', {
    title: 'メールを送信しました',
    message: 'メールに記載した手順で登録手続きをすすめてください',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
  });
});

// 登録手続きメールからアクセスしたとき
router.get('/details', csrfProtection, async (req, res, next) => {
  (async () => {
    const urlToken = req.query.t;

    // urlTokenがundefinedまたはurlTokenのフォーマットがuuidでないとき
    if (!urlTokenIsValid(urlToken)) {
      return res.redirect('/register?message=無効なURLです。最初からやり直してください。');
    }

    // urlTokenが有効かチェック
    const result = await checkUrlTokenUseCase.execute(urlToken as string);

    // 有効ならばフォームを表示
    if (result.ok) {
      return res.render('registerForm', {
        title: 'ユーザーアカウント登録画面2',
        type: 'registerUser',
        urlToken,
        postTo: '/register/details',
        message: req.query.message,
        loggedIn: req.session.loggedIn,
        userName: req.session.userName,
        csrfToken: req.csrfToken(),
      });
    }

    // 無効(期限切れ)ならばその旨とEメールアドレス登録フォームを表示する
    if (result.reason === 'expired') {
      return res.redirect('/register?message=期限切れです。最初からやり直してください。');
    }

    // 無効ならばその旨とEメールアドレス登録フォームを表示する
    // urlTokenと紐づく仮登録ユーザーが存在しないとき
    if (result.reason === 'tempUserNotExist') {
      return res.redirect('/register?message=無効なURLです。最初からやり直してください。');
    }

    return res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/register?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

router.post('/details', csrfProtection, async (req, res, next) => {
  (async () => {
    const { urlToken, name, password1, password2 } = req.body;

    if (
      !userNameIsValid(name) ||
      !passwordIdValid(password1) ||
      !passwordIdValid(password2) ||
      !urlTokenIsValid(urlToken)
    ) {
      return res.redirect('/register?message=最初からやり直してください。');
    }

    const result = await registerUserUseCase.execute({
      userNameValue: name,
      urlTokenValue: urlToken,
      password1,
      password2,
    });

    if (result.ok) {
      req.session.loggedIn = true;
      req.session.userName = name;
      req.session.save((err) => {
        if (err) {
          res.redirect('/login');
        }
        res.redirect('/');
      });
      return;
    }

    // 期限切れのとき
    if (result.reason === 'expired') {
      return res.redirect('/register?message=期限切れです。最初からやり直してください。');
    }

    return res.redirect(
      `/register/details?message=申し訳ありません。しばらく時間をおいてから試してください。&t=${urlToken}`
    );
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
