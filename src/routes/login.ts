import express from 'express';
import { loginUseCase } from '../useCase/init';

const router = express.Router();

router.get('/', (req, res, _next) => {
  const from = req.query.from;
  if (from) {
    res.cookie('loginFrom', from, { expires: new Date(Date.now() + 600000) });
  }

  res.render('login', { message: req.query.message });
});

router.post('/', (req, res, next) => {
  (async () => {
    const { email, password } = req.body;

    if (typeof email !== 'string' && typeof password !== 'string') {
      return res.redirect('/login?message=ログインに失敗しました');
    }

    // TODO: プレゼンテーション層でのバリデーションどうする？
    // if (!Email.isValid(email) && !Password.validation(password)) {
    //   return res.redirect('/login?message=ログインに失敗しました');
    // }

    const result = await loginUseCase.execute(email, password);

    if (result.isSucceeded) {
      req.session.loggedIn = true;
      req.session.userName = result.userName;

      const loginFrom = req.cookies.loginFrom;
      if (loginFrom && loginFrom.startsWith('/')) {
        res.clearCookie('loginFrom');
        return res.redirect(loginFrom);
      }

      return res.redirect('/');
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
