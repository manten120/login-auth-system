export class UserName {
  private constructor (public readonly value: string) {}

  static readonly MIN_LENGTH = 1;

  static readonly MAX_LENGTH = 30;

  static readonly create = (userNameValue: string) => {
    if (userNameValue.length < this.MIN_LENGTH) {
      throw new Error(`ユーザー名は${this.MIN_LENGTH}文字以上です`)
    }

    if (userNameValue.length > this.MAX_LENGTH) {
      throw new Error(`ユーザー名は${this.MAX_LENGTH}文字以下です`)
    }

    return new UserName(userNameValue);
  }

  static readonly reconstruct = (userNameValue: string) => new UserName(userNameValue);
}