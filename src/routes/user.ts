import express from 'express';
const router = express.Router();


router.get('/', (req, res, _next) => {
  res.render('user', { title: 'ログイン後の画面', userName: req.session.userName, })
});

// router.get('/edit', (_req, res, _next) => {
//   res.send('パスワード変更画面');
// });

// // patchメソッドのほうがいい?
// router.patch('/edit', (_req, res, _next) => {
//   // パスワードを変更する処理

//   // 結果を返す
//   res.send('パスワード変更のための情報を受け取るエンドポイント');
// });

export { router as userRouter };
