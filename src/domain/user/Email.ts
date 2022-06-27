import { encrypt, decrypt } from "../../adapter/encrypt";

export class Email {
  private constructor(public readonly encryptedValue: string) {}

  static readonly create = (emailPlainValue: string) => {
    // TODO: ヴァリデーション

    // 暗号化
    const emailEncryptedValue = encrypt(emailPlainValue);

    return new Email(emailEncryptedValue);
  };

  static readonly reconstruct = (emailEncryptedValue: string) => new Email(emailEncryptedValue);

  readonly plainValue = () => decrypt(this.encryptedValue); // 復号化
}
