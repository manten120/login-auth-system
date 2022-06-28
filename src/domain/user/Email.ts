import { encrypt, decrypt } from '../../adapter/encrypt';
import { hash } from '../../adapter/hash';

export class Email {
  private constructor(public readonly hashedValue: string, public readonly encryptedValue: string) {}

  static readonly isValid = (emailPlainValue: string) => {
    const html5EmailRegExp =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return html5EmailRegExp.test(emailPlainValue);
  };

  static readonly create = (emailPlainValue: string) => {
    if (!Email.isValid(emailPlainValue)) {
      throw new Error('HTML5のメールアドレスを表す正規表現と合致しません');
    }

    const emailHashedValue = hash(emailPlainValue);

    // 暗号化
    const emailEncryptedValue = encrypt(emailPlainValue);

    return new Email(emailHashedValue, emailEncryptedValue);
  };

  static readonly reconstruct = (emailHashedValue: string, emailEncryptedValue: string) =>
    new Email(emailHashedValue, emailEncryptedValue);

  readonly plainValue = () => decrypt(this.encryptedValue); // 復号化
}
