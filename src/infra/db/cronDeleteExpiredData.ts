import cron from 'node-cron';
import { sequelize } from './sequelize-loader';

export const cronDeleteExpiredData = () => {
  cron.schedule(
    '0,30 * * * *',
    () => {
      sequelize.query(`DELETE FROM forgotten_users WHERE expired_at < "${new Date(Date.now()).toISOString()}"`);
    },
    {
      timezone: 'Asia/Tokyo',
    }
  );
  cron.schedule(
    '0 0 * * *',
    () => {
      sequelize.query(`DELETE FROM temp_users WHERE expired_at < "${new Date(Date.now()).toISOString()}"`);
    },
    {
      timezone: 'Asia/Tokyo',
    }
  );
};
