import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-loader';

export type UserModelAttributes = {
  id: string;
  name: string;
  hashed_email: string;
  encrypted_email: string;
  password: string;
};

export class UserModel extends Model<UserModelAttributes> {
  declare id: string;
  declare name: string;
  declare hashed_email: string;
  declare encrypted_email: string;
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
    hashed_email: {
      type: DataTypes.STRING,
      allowNull: false,
      // primaryKey: true,
    },
    encrypted_email: {
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
