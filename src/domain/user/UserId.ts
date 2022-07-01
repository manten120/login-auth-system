import crypto from 'crypto';

export class UserId {
  private constructor(public value: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);

    if (!isUUID) {
      throw new Error('UUIDのフォーマットと異なります');
    }
  }

  static readonly create = () => {
    const uuid = crypto.randomUUID();
    return new UserId(uuid);
  };

  static readonly reconstruct = (userIdValue: string) => new UserId(userIdValue);
}
