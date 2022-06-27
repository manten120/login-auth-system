import { Email } from '../user/Email';
import { ITempUserRepository } from '../tempUser/ITempUserRepository';
import { IUserRepository } from '../user/IUserRepository';
import { TempUser } from '../tempUser/TempUser';
import { IMailer } from '../mailer/IMailer';
import { CreateUserMail } from '../mailer/CreateUserMail';

export class CreateTempUserService {
  constructor(
    private readonly tempUserRepository: ITempUserRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer
  ) {}

  private readonly emailIsDuplicated = async (email: Email) => {
    const [tempUser, user] = await Promise.all([
      this.tempUserRepository.findByEmail(email),
      this.userRepository.findByEmail(email),
    ]);

    if (tempUser || user) {
      return true;
    }

    return false;
  };

  readonly execute = async (emailPlainValue: string) => {
    // EmailAddressの重複チェック
    const email = Email.create(emailPlainValue);

    const isDuplicated = await this.emailIsDuplicated(email);

    // userと重複しているならば仮登録不可
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return {  }
    }

    const tempUser = await this.tempUserRepository.findByEmail(email);

    if (tempUser) {
      tempUser
    }

    // tempUserと重複しているならば...

    if (isDuplicated) {
      return { };
    }

    // tempUserを作成、永続化
    const newTempUser = TempUser.create(email);
    await this.tempUserRepository.save(newTempUser);

    // Emailを送信
    const createUserMail = new CreateUserMail(newTempUser.email, newTempUser.urlToken);
    this.mailer.send(createUserMail);

    return { };
  };
}
