import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'login_auth',
  'root',
  process.env.MYSQL_ROOT_PASSWORD,
  {
    dialect: 'mysql',
    host: 'mysql8',
    port: 3306,
  }
);
