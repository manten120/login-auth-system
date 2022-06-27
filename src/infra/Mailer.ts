import nodemailer from 'nodemailer';
import { IMail } from '../domain/mailer/IMail';
import { IMailer } from '../domain/mailer/IMailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
} as any);

class Mailer implements IMailer {
  constructor(private readonly transporter: nodemailer.Transporter<unknown>) {}

  // transporter = transporter;

  readonly send = (mail: IMail) => {
    const data = {
      from: `"${mail.from}" <${process.env.MAIL_USER}>`, // 宛先がyahooメールの場合日本語は文字化けする。gmailはしない。<foo@example.com>を削除すると通常のメールアドレス表示になってしまう。
      to: mail.to,
      text: mail.text, // htmlが設定されていればそちらを優先。htmlが表示されない時はこれが本文になる?
      // html: 'HTMLメール本文<br>HTMLメール本文<br>HTMLメール本文',
      subject: mail.subject,
    };

    this.transporter.sendMail(data, (error: any, info: any) => {
      if (error) {
        console.log(error); // エラー情報
      } else {
        console.log(info); // 送信したメールの情報
      }
    });
  };
}

export const mailer = new Mailer(transporter);
