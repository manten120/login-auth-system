import session from 'express-session';
import mysqlExpress from 'express-mysql-session';
import mysql2 from 'mysql2/promise';

const MySQLStore = mysqlExpress(session as any);

const options = {
  host: 'mysql8',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'login_auth',
};

const connection = mysql2.createPool(options);
const sessionStore = new MySQLStore({}, connection);

export const sessionHandler = session({
  name: 'BMDv21zlrGbYWb',
  secret: process.env.SESSION_SECRET!,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true, // アクセス毎にmaxAgeを更新
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
  },
});

declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean;
    userName: string;
  }
}
