// パスワード変更の期限
export class ExpiredAt {
  private constructor(public readonly value: string) {}

  private static readonly REMAINING_MINUTES = 1;

  static readonly create = () => {
    const currentTimeInMillisecondFormat = Date.now();
    const remainingMilliseconds = ExpiredAt.REMAINING_MINUTES * 60 * 1000;
    const expiredAtValue = new Date(currentTimeInMillisecondFormat + remainingMilliseconds).toISOString();
    return new ExpiredAt(expiredAtValue);
  };

  static readonly reconstruct = (expiredAtValue: string) => new ExpiredAt(expiredAtValue);

  readonly extend = () => ExpiredAt.create();

  readonly isPast = () => {
    const diff = Date.parse(this.value) - Date.now();
    if (diff < 0) {
      return true;
    }
    return false;
  }
}
