import { encrypt, decrypt } from "../../adapter/encrypt";

export class Email {
  private constructor(public readonly encryptedValue: string) {}

  static readonly isValid = (emailPlainValue: string) => {
    const html5EmailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return html5EmailRegExp.test(emailPlainValue);
  }

  static readonly create = (emailPlainValue: string) => {
    if (!Email.isValid(emailPlainValue)) {
      throw new Error('HTML5のメールアドレスを表す正規表現と合致しません');
    }

    // 暗号化
    const emailEncryptedValue = encrypt(emailPlainValue);

    return new Email(emailEncryptedValue);
  };

  static readonly reconstruct = (emailEncryptedValue: string) => new Email(emailEncryptedValue);

  readonly plainValue = () => decrypt(this.encryptedValue); // 復号化
}
