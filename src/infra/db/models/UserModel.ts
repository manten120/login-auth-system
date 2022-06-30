import { DataTypes, Model, InferAttributes } from 'sequelize';
import { sequelize } from '../sequelize-loader';

export class UserModel extends Model<InferAttributes<UserModel>> {
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
