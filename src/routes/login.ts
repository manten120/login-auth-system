import express from 'express';
import { loginUseCase } from '../useCase/init';
import { csrfProtection } from '../adapter/csrfProtection';

const router = express.Router();

router.get('/', csrfProtection, (req, res, _next) => {
  const from = req.query.from;
  if (from) {
    // ログイン後の画面からログイン画面にリダイレクトしたとき
    res.cookie('loginFrom', from, { expires: new Date(Date.now() + 10*60*1000) });
  } else {
    res.clearCookie('loginFrom');
  }

  res.render('login', {
    message: req.query.message,
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
    csrfToken: req.csrfToken(),
  });
});

router.post('/', csrfProtection, (req, res, next) => {
  (async () => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.redirect('/login?message=ログインに失敗しました');
    }

    // if (!Email.isValid(email) && !Password.validation(password)) {
    //   return res.redirect('/login?message=ログインに失敗しました');
    // }

    const result = await loginUseCase.execute(email, password);

    if (result.isSucceeded) {
      req.session.loggedIn = true;
      req.session.userName = result.userName;

      const loginFrom = req.cookies.loginFrom;

      // 未ログイン状態でログイン後のページにアクセスし、リダイレクトされてログイン画面に来ていたとき
      if (loginFrom && loginFrom.startsWith('/')) {
        res.clearCookie('loginFrom');

        return req.session.save((err) => {
          if (err) {
            req.session.destroy(() => {
              throw new Error(err);
            });
          }
          res.redirect(loginFrom);
        });
      }

      return req.session.save((err) => {
        if (err) {
          req.session.destroy(() => {
            throw new Error(err);
          });
        }
        res.redirect('/');
      });
    }

    return res.redirect('/login?message=ログインに失敗しました');
  })().catch((e) => {
    if (req.app.get('env') === 'production') {
      res.redirect('/login?message=ログインに失敗しました');
    }
    next(e);
  });
});

export { router as loginRouter };
