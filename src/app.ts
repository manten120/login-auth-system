import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import helmet from 'helmet';
import { indexRouter } from './routes/index';
import { registerRouter } from './routes/register';
import { userRouter } from './routes/user';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { forgetPasswordRouter } from './routes/forgetPassword';
import { initDB } from './infra/db/initDB';

import { sessionHandler } from './session';

initDB();

const app = express();

app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(sessionHandler);

// TODO: 削除
app.use((req, res, next) => {
  console.log('app.ts', req.session);
  next();
});

const loggedInCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.loggedIn) {
    return res.redirect(`/login?from=${req.originalUrl}`);
  }
  next();
};

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/user', loggedInCheck, userRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/forget-password', forgetPasswordRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app };
