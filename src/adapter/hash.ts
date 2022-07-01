import { createHash } from 'crypto';

export const hash = (plainText: string) => {
  const salt = process.env.PASSWORD_SALT;
  const hashedValue = createHash('sha256')
    .update(plainText + salt)
    .digest('hex');
  return hashedValue;
};
