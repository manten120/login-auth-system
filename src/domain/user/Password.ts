import { hash } from "../../adapter/hash";

export class Password {
  private constructor(public readonly hashedValue: string) {}

  static readonly create = (passwordPlainValue1: string, passwordPlainValue2: string) => {
    if (passwordPlainValue1 !== passwordPlainValue2) {
      throw new Error('2つのパスワードが一致しません');
    }

    if (!(/[a-zA-Z0-9]{8,64}/.test(passwordPlainValue1))) {
      throw new Error('パスワードは半角英数からなる8~64文字の文字列です');
    }

    const hashedValue = hash(passwordPlainValue1)

    return new Password(hashedValue);
  };

  static readonly reconstruct = (passwordHashedValue: string) => new Password(passwordHashedValue);
}
