import { Email } from '../domain/user/Email';
import { TempUser } from '../domain/tempUser/TempUser';
import { IUserRepository } from '../domain/user/IUserRepository';
import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { IMailer } from '../domain/mailer/IMailer';
import { CreateUserMail } from '../domain/mailer/CreateUserMail';

export class CreateTempUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tempUserRepository: ITempUserRepository,
    private readonly mailer: IMailer
  ) {}

  readonly execute = async (emailPlainValue: string) => {
    const email = Email.create(emailPlainValue);

    // userと重複しているならば仮登録不可
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return { ok: false, reason: 'registered', message: '登録済みのメールアドレスです' };
    }

    const tempUser = await this.tempUserRepository.findByEmail(email);

    // 同一メールアドレスのtempUserが存在しないとき
    if (!tempUser) {
      // tempUserを作成、永続化
      const newTempUser = TempUser.create(email);
      await this.tempUserRepository.save(newTempUser);

      // Emailを送信
      const createUserMail = new CreateUserMail(newTempUser.email, newTempUser.urlToken);
      this.mailer.send(createUserMail);

      return { ok: true, reason: 'mailed', message: '' };
    }

    // tempUserと重複しているならば...
    if (tempUser && tempUser.canRepeatReceivingMail()) {
      tempUser.repeatReceivingMail();

      console.log(tempUser.repeatedTimes.value);

      await this.tempUserRepository.update(tempUser);

      // Emailを送信
      const createUserMail = new CreateUserMail(tempUser.email, tempUser.urlToken);
      this.mailer.send(createUserMail);

      return { ok: true, reason: 'mailed', message: '' };
    }

    return { ok: false, reason: 'exceeded', message: '回数が多すぎです' };
  };
}
