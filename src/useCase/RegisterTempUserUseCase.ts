import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { TempUser } from '../domain/tempUser/TempUser';
import { IUserRepository } from '../domain/user/IUserRepository';
import { Email } from '../domain/user/Email';
import { IMailer } from '../domain/mailer/IMailer';
import { RegisterUserMail } from '../domain/mailer/RegisterUserMail';

type Result =
  | {
      ok: false;
      reason: 'userAlreadyRegistered' | 'sendingEmailFailed' | 'exceeded';
    }
  | {
      ok: true;
    };

export class RegisterTempUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tempUserRepository: ITempUserRepository,
    private readonly mailer: IMailer
  ) {}

  private readonly sendRegisterUserMailTo = async (tempUser: TempUser) => {
    const registerUserMail = new RegisterUserMail(tempUser.email, tempUser.urlToken);
    const isSucceeded = await this.mailer.send(registerUserMail);
    return isSucceeded;
  };

  readonly execute = async (emailPlainValue: string): Promise<Result> => {
    const email = Email.create(emailPlainValue);

    // メールアドレスがユーザーと重複しているならば仮登録不可
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      return { ok: false, reason: 'userAlreadyRegistered' };
    }

    const tempUser = await this.tempUserRepository.findByEmail(email);

    // 同一メールアドレスの仮登録ユーザーが存在しないとき
    if (!tempUser) {
      // 仮登録ユーザーを作成、永続化
      const newTempUser = TempUser.create(email);
      await this.tempUserRepository.insert(newTempUser);

      // 登録手続きメールを送信
      const isSucceeded = await this.sendRegisterUserMailTo(newTempUser);

      if (isSucceeded) {
        return { ok: true };
      }

      return { ok: false, reason: 'sendingEmailFailed' };
    }

    // 仮登録ユーザーの期限を延長する
    tempUser.extendDeadLine();

    // 仮登録済みのとき
    if (tempUser && tempUser.canRepeatReceivingMail()) {
      // 仮登録を繰り返した回数を更新する
      tempUser.repeatReceivingMail();
      this.tempUserRepository.update(tempUser);

      // 登録手続きメールを送信
      const isSucceeded = await this.sendRegisterUserMailTo(tempUser);

      if (isSucceeded) {
        return { ok: true };
      }

      return { ok: false, reason: 'sendingEmailFailed' };
    }

    // 短時間で仮登録を繰り返したとき
    return { ok: false, reason: 'exceeded' };
  };
}
