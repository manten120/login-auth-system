import { hash } from '../../adapter/hash';

export class Password {
  private constructor(private readonly _hashedValue: string, private readonly canSave: boolean) {}

  get hashedValue() {
    if (this.canSave) {
      return this._hashedValue;
    }
    throw new Error('ユーザー登録時またはパスワード変更時に生成したPasswordインスタンスからのみ値を取り出すことができます');
  }

  static readonly create = (passwordPlainValue1: string, passwordPlainValue2: string) => {
    if (passwordPlainValue1 !== passwordPlainValue2) {
      throw new Error('2つのパスワードが一致しません');
    }

    if (!/[a-zA-Z0-9]{8,64}/.test(passwordPlainValue1)) {
      throw new Error('パスワードは半角英数からなる8~64文字の文字列です');
    }

    const hashedValue = hash(passwordPlainValue1);

    return new Password(hashedValue, true);
  };

  static readonly createToLogin = (passwordPlainValue: string) => {
    if (!/[a-zA-Z0-9]{8,64}/.test(passwordPlainValue)) {
      throw new Error('パスワードは半角英数からなる8~64文字の文字列です');
    }

    const hashedValue = hash(passwordPlainValue);

    return new Password(hashedValue, false);
  };

  static readonly reconstruct = (passwordHashedValue: string) => new Password(passwordHashedValue, false);

  readonly equals = (password: Password) => this._hashedValue === password._hashedValue;

  readonly change = (passwordPlainValue1: string, passwordPlainValue2: string) => Password.create(passwordPlainValue1, passwordPlainValue2);
}
