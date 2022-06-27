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

    // メールアドレスが既存ユーザーと重複しているならば仮登録不可
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return { ok: false, reason: 'alreadyRegistered' };
    }

    const tempUser = await this.tempUserRepository.findByEmail(email);

    // 同一メールアドレスの仮登録ユーザーが存在しないとき
    if (!tempUser) {
      // tempUserを作成、永続化
      const newTempUser = TempUser.create(email);
      await this.tempUserRepository.insert(newTempUser);

      // Emailを送信
      const createUserMail = new CreateUserMail(newTempUser.email, newTempUser.urlToken);
      const isSucceeded = await this.mailer.send(createUserMail);

      if (isSucceeded) {
        return { ok: true, reason: 'mailed' };
      }

      return { ok: false, reason: 'emailFailed' };
    }

    // メールアドレスが既存の仮登録ユーザーと重複しているとき
    if (tempUser && tempUser.canRepeatReceivingMail()) {
      tempUser.repeatReceivingMail();
      this.tempUserRepository.update(tempUser);

      // Emailを送信
      const createUserMail = new CreateUserMail(tempUser.email, tempUser.urlToken);
      const isSucceeded = await this.mailer.send(createUserMail);

      if (isSucceeded) {
        return { ok: true, reason: 'mailed' };
      }

      return { ok: false, reason: 'emailFailed' };
    }

    // 短時間で仮登録を繰り返したとき
    return { ok: false, reason: 'exceeded' };
  };
}
