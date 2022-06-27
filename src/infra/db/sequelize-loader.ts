import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'login_auth',
  'root',
  process.env.MYSQL_ROOT_PASSWORD,
  {
    dialect: 'mysql',
    host: 'mysql8',
    port: 3306,
  }
);

export default sequelize;