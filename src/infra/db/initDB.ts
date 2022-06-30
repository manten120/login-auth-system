import { UserModel } from './models/UserModel';
import { ForgottenUserModel } from './models/ForgottenUserModel';
import { sequelize } from './sequelize-loader';
import { cronDeleteExpiredData } from './cronDeleteExpiredData';

export const initDB = () => {
  // DBテーブル作成
  ForgottenUserModel.belongsTo(UserModel, {
    foreignKey: { name: 'user_id', allowNull: false },
    targetKey: 'id',
  });
  sequelize.sync();

  // 期限切れのデータを削除する処理を定期実行する
  cronDeleteExpiredData();
};
