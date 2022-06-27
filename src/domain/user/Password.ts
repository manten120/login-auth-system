export class Password {
  private constructor(public readonly hashedValue: string) {
    // TODO: ヴァリデーション
    
  }

  static readonly create = (passwordPlainValue: string) => {
    // TODO: ヴァリデーション

    // TODO: ハッシュ化
    const hashedValue = 'hogehogehogehogehoge';

    return new Password(hashedValue);
  };

  static readonly reconstruct = (passwordHashedValue: string) => new Password(passwordHashedValue);
}
