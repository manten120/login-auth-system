import crypto from 'crypto';

// AES アルゴリズム
const algorithm = 'aes-256-cbc';

// 事前に共有すべきパスワード
// console.log(crypto.randomBytes(32).toString('base64'))
const password = 'l+/MraaOI1yT3F1l15fJMcEKGiG3iWn7nOTmUS4fWk0=';

// 事前に共有すべき SALT
// console.log(crypto.randomBytes(16).toString('base64'))
const salt = 'kr3dJJ1mPcIKisMOR4RO6w==';

// 暗号化したいメッセージ
const MESSAGE = 'piyopiyo';

// IV を生成
const iv = crypto.randomBytes(16);

export const encrypt = (data: string) => {
  // 鍵を生成
  const key = crypto.scryptSync(password, salt, 32);

  // 暗号器を生成
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  // data を暗号化
  let encryptedData = cipher.update(data);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);

  const encryptedString = encryptedData.toString('hex');

  return encryptedString;
};

// 復号メソッド
export const decrypt = (encryptedString: string) => {
  const encryptedData = Buffer.from(encryptedString, 'hex');

  // 鍵を生成
  const key = crypto.scryptSync(password, salt, 32)

  // 復号器を生成
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // encryptedData を復号
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);

  return decryptedData.toString();
};
