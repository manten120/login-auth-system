import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export { router as logoutRouter };
