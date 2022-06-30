import crypto from 'crypto';

export class UrlToken {
  private constructor(public value: string) {
    if (!UrlToken.isUUID(value)) {
      throw new Error('UUIDのフォーマットと異なります');
    }
  }

  static readonly isUUID = (urlTokenValue: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(urlTokenValue);

  static readonly create = () => {
    const uuid = crypto.randomUUID();
    return new UrlToken(uuid);
  };

  static readonly reconstruct = (urlTokenValue: string) => new UrlToken(urlTokenValue);
}
