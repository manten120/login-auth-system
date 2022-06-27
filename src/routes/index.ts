import express from 'express';
const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.render('index', { title: '「ログイン後の画面」以外のURLで表示される画面' });
});

export { router as indexRouter }