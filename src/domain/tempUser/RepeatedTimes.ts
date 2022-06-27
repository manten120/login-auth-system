export class RepeatedTimes {
  static MIN_TIMES = 1;
  
  static MAX_TIMES = 10;

  private constructor(public readonly value: number) {
    if (value < RepeatedTimes.MIN_TIMES) {
      throw new Error(`最小値は${RepeatedTimes.MIN_TIMES}です`);
    }

    if (value > RepeatedTimes.MAX_TIMES) {
      throw new Error(`最大値は${RepeatedTimes.MAX_TIMES}です`);
    }
  }

  static readonly create = () => new RepeatedTimes(RepeatedTimes.MIN_TIMES);

  static readonly reconstruct = (repeatedTimesValue: number) => new RepeatedTimes(repeatedTimesValue);

  readonly increment = () => new RepeatedTimes(this.value + 1);

  readonly isMax = () => this.value === RepeatedTimes.MAX_TIMES;
}
