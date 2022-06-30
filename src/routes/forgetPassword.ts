import express from 'express';
import { csrfProtection } from '../adapter/csrfProtection';
import { UrlToken } from '../domain/shared/UrlToken';
import { Email } from '../domain/user/Email';
import { sendEmailToChangePasswordUseCase } from '../useCase/init';
import { checkUrlTokenToChangePasswordUseCase } from '../useCase/init';
import { changePasswordUseCase } from '../useCase/init';

const router = express.Router();

// パスワード変更開始画面 Eメールアドレスを入力するフォームを表示する
router.get('/', csrfProtection, (req, res, _next) => {
  res.render('emailForm', {
    type: 'forgetPassword',
    note: req.query.note,
    title: 'パスワードをお忘れですか?',
    message: req.query.message
      ? req.query.message
      : 'メールアドレスを入力してください。パスワード変更のためのメールをお送りします。',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
    csrfToken: req.csrfToken(),
  });
});

// Eメールアドレスを受け取り、パスワード変更メールを送信する
router.post('/', csrfProtection, (req, res, next) => {
  (async () => {
    const { email } = req.body;

    // 明らかにEメールアドレスではない値がPOSTされたとき
    if (typeof email !== 'string' || !Email.isValid(email)) {
      return res.redirect('/forget-password/emailed');
    }

    const result = await sendEmailToChangePasswordUseCase.execute(email);

    if (result.ok) {
      return res.redirect('/forget-password/emailed');
    }

    // Eメールアドレスに対応するユーザーが存在しないとき
    if (result.reason === 'userNotExists') {
      return res.redirect('/forget-password/emailed');
    }

    // パスワード変更メールの送信に失敗したとき
    if (result.reason === 'sendingEmailFailed') {
      return res.redirect('/forget-password?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }

    // パスワード変更メールの送信リクエストを過度に繰り返したとき
    return res.redirect('/forget-password?message=申し訳ありません。しばらく時間をおいてから試してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/forget-password?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

// パスワード変更メールを送信した旨を表示する
router.get('/emailed', (req, res, _next) => {
  res.render('message', {
    title: 'メールを送信しました',
    message: 'メールに記載した手順でパスワードを変更してください',
    link: '/forget-password',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
  });
});

// パスワード変更メールのリンクからアクセスしたとき
// 新しいパスワードを入力するフォームを表示する
router.get('/change', csrfProtection, (req, res, next) => {
  (async () => {
    const urlToken = req.query.t;

    // urlTokenがundefinedまたはurlTokenのフォーマットがuuidでないとき
    if (typeof urlToken !== 'string' || !UrlToken.isUUID(urlToken)) {
      return res.redirect('/forget-password?message=無効なURLです。最初からやり直してください。');
    }

    const result = await checkUrlTokenToChangePasswordUseCase.execute(urlToken);

    if (result.ok) {
      return res.render('registerForm', {
        title: '新しいパスワードを入力してください',
        type: 'changePassword',
        urlToken,
        postTo: '/forget-password/change',
        message: req.query.message,
        loggedIn: req.session.loggedIn,
        userName: req.session.userName,
        csrfToken: req.csrfToken(),
      });
    }

    if (result.reason === 'expired') {
      return res.redirect('/forget-password?message=期限切れです。最初からやり直してください。');
    }

    return res.redirect('/forget-password?message=無効なURLです。最初からやり直してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/forget-password?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

// 新しいパスワードを受け取る
router.post('/change', csrfProtection, (req, res, next) => {
  (async () => {
    const { urlToken, password1, password2 } = req.body;
    
    if (typeof urlToken !== 'string' || typeof password1 !== 'string' || typeof password2 !== 'string') {
      return;
    }

    // TODO Passwordのバリデーション
    if (!UrlToken.isUUID(urlToken)) {
      return;
    }

    const result = await changePasswordUseCase.execute({
      urlTokenValue: urlToken,
      passwordPlainValue1: password1,
      passwordPlainValue2: password2,
    });

    if (result.ok) {
      return res.redirect('/login?message=パスワードを変更しました');
    }

    if (result.reason === 'userNotExist') {
      return res.redirect(
        '/register?message=アカウントが存在しません。新規作成する場合はメールアドレスを登録してください'
      );
    }

    return res.redirect('/forget-password?message=期限切れです。最初からやり直してください。');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/forget-password?message=申し訳ありません。しばらく時間をおいてから試してください。');
    }
    next(e);
  });
});

export { router as forgetPasswordRouter };
