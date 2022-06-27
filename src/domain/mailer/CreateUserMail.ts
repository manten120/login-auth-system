import { port } from '../../bin/www';
import { IMail } from './IMail';
import { Email } from '../user/Email';
import { UrlToken } from '../tempUser/UrlToken';

// ユーザーアカウント登録開始時に送るメール
export class CreateUserMail implements IMail {
  // 送信元の名前
  readonly from = 'login-auth-system';

  // 送信先のEメールアドレス
  readonly to: string;

  // 件名
  readonly subject = 'ご登録手続きのメール';

  // 本文
  readonly text: string;

  constructor(email: Email, urlToken: UrlToken) {
    // TODO: URLを変更
    this.text = `30分以内に下記のURLからご登録下さい。
      \n\n http://localhost:${port}?token=${urlToken.value}`;

    this.to = email.plainValue();
  }
}
