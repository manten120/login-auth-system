import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize-loader';

export type UserModelAttributes = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export class UserModel extends Model<UserModelAttributes> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    freezeTableName: true,
  }
);
