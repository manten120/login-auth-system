import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (_req, res, _next) => {
  res.render('index', { title: 'Express' });
});

export { router as indexRouter }