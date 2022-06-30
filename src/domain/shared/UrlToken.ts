import crypto from 'crypto';

// 登録手続きメールまたはパスワード変更メールに記載のURLの末尾に付き、
// ユーザーを一意に識別するためのクエリストリング
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
