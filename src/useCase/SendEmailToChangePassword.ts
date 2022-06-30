import { IUserRepository } from "../domain/user/IUserRepository";
import { IMailer } from "../domain/mailer/IMailer";
import { ChangePasswordMail } from "../domain/mailer/ChangePasswordMail";
import { Email } from "../domain/user/Email";
import { ForgottenUser } from "../domain/forgottenUser/ForgottenUser";
import { IForgottenUserRepository } from "../domain/forgottenUser/IForgottenUserRepository";

type Result = {
  ok: true;
} | {
  ok: false;
  reason: 'userNotExists' | 'sendingEmailFailed' | 'exceeded';
}

export class SendEmailToChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly forgottenUserRepository: IForgottenUserRepository,
    private readonly mailer: IMailer,
  ){}

  private readonly sendChangePasswordMailTo = async (forgottenUser: ForgottenUser) => {
    const changePasswordMail = new ChangePasswordMail(forgottenUser.email, forgottenUser.urlToken); 
    const isSucceeded = await this.mailer.send(changePasswordMail);
    return isSucceeded;
  }

  readonly execute = async (emailPlainValue: string): Promise<Result> => {
    const email = Email.create(emailPlainValue);
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      return { ok: false, reason: 'userNotExists' };
    }

    const forgottenUser = await this.forgottenUserRepository.findByEmail(email);

    if (!forgottenUser) {
      const newForgottenUser = ForgottenUser.create(user);
      await this.forgottenUserRepository.insert(newForgottenUser);

      const isSucceeded = await this.sendChangePasswordMailTo(newForgottenUser);

      if (isSucceeded) {
        return { ok: true };
      }

      return { ok: false, reason: 'sendingEmailFailed' };
    }

    forgottenUser.extendDeadLine();

    if (forgottenUser.canRepeatReceivingMail()) {
      forgottenUser.repeatReceivingMail();
      this.forgottenUserRepository.update(forgottenUser);

      const isSucceeded = await this.sendChangePasswordMailTo(forgottenUser);

      if (isSucceeded) {
        return { ok: true };
      }

      return { ok: false, reason: 'sendingEmailFailed' };
    }

    return { ok: false, reason: 'exceeded' };
  }
}
