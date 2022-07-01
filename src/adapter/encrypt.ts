import crypto from 'crypto';

// AES アルゴリズム
const algorithm = 'aes-256-cbc';

// 事前に共有すべきパスワード
// console.log(crypto.randomBytes(32).toString('base64'))
const password = process.env.ENCRYPT_PASSWORD!;

// 事前に共有すべき SALT
// console.log(crypto.randomBytes(16).toString('base64'))
const salt = process.env.ENCRYPT_SALT!;

export const encrypt = (data: string) => {
  // 鍵を生成
  const key = crypto.scryptSync(password, salt, 32);

  // IV を生成
  const iv = crypto.randomBytes(16);

  // 暗号器を生成
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  // data を暗号化
  let encryptedData = cipher.update(data);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);

  // 暗号化したdataとivを結合した文字列
  const encryptedDataAndIvString = Buffer.concat([iv, encryptedData]).toString('base64');

  return encryptedDataAndIvString;
};

// 復号メソッド
export const decrypt = (encryptedDataAndIvString: string) => {
  const encryptedDataAndIvBuffer = Buffer.from(encryptedDataAndIvString, 'base64');
  const iv = encryptedDataAndIvBuffer.slice(0, 16);
  const encryptedData = encryptedDataAndIvBuffer.slice(16);

  // 鍵を生成
  const key = crypto.scryptSync(password, salt, 32);

  // 復号器を生成
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // encryptedData を復号
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);

  return decryptedData.toString();
};
