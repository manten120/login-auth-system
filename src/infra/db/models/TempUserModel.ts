import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize-loader';

export type TempUserModelAttributes = {
  hashed_email: string;
  encrypted_email: string;
  url_token: string;
  expired_at: string;
  repeated_times: number;
};

export class TempUserModel extends Model<TempUserModelAttributes> {
  declare hashed_email: string;
  declare encrypted_email: string;
  declare url_token: string;
  declare expired_at: string;
  declare repeated_times: number;
}

TempUserModel.init(
  {
    hashed_email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    encrypted_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repeated_times: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'temp_users',
    sequelize,
    freezeTableName: true,
  }
);
