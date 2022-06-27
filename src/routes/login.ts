import express from 'express';
const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.send('ログイン画面');
});

router.post('/', (_req, res, _next) => {
  res.send('ログインするための情報を受け取るエンドポイント');
});

export { router as loginRouter }
