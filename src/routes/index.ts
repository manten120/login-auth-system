import express from 'express';

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.render('index', {
    title: 'トッページ',
    message: '「ログイン後の画面」以外のURLで表示される画面',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
  });
});

export { router as indexRouter };
