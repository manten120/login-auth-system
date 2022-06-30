import { port } from '../../bin/www';
import { IMail } from './IMail';
import { Email } from '../user/Email';
import { UrlToken } from '../shared/UrlToken';

// パスワード変更時に送るメール
export class ChangePasswordMail implements IMail {
  // 送信元の名前
  readonly from = 'login-auth-system';

  // 送信先のEメールアドレス
  readonly to: string;

  // 件名
  readonly subject = 'パスワード変更手続きのメール';

  // 本文
  readonly text: string;

  constructor(email: Email, urlToken: UrlToken) {
    // TODO: URLを変更
    this.text = `30分以内に下記のURLからパスワード変更の手続きを完了してください。
        \n\n http://localhost:${port}/forget-password/change?t=${urlToken.value}`;
    this.to = email.plainValue();
  }
}
