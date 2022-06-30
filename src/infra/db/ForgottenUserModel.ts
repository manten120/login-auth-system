import { DataTypes, Model, ForeignKey, InferAttributes } from 'sequelize';
import { sequelize } from './sequelize-loader';
import { UserModel } from './UserModel';

export class ForgottenUserModel extends Model<InferAttributes<ForgottenUserModel>> {
  declare user_id: ForeignKey<UserModel['id']>;
  declare hashed_email: string;
  declare encrypted_email: string;
  declare url_token: string;
  declare repeated_times: number;
  declare expired_at: string;
}

ForgottenUserModel.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    hashed_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encrypted_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repeated_times: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'forgotten_users',
    sequelize,
    freezeTableName: true,
  }
);
