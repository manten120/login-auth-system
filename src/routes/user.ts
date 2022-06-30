import express from 'express';

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.render('user', {
    title: 'ログイン後の画面',
    loggedIn: req.session.loggedIn,
    userName: req.session.userName,
  });
});

export { router as userRouter };
