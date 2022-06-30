import { IUserRepository } from '../domain/user/IUserRepository';
import { Email } from '../domain/user/Email';
import { Password } from '../domain/user/Password';

type Result = {
  isSucceeded: true
  userName: string;
} | {
  isSucceeded: false;
}

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  readonly execute = async (emailPlainValue: string, passwordPlainValue: string): 
  Promise<Result> => {
    const email = Email.create(emailPlainValue);
    const password = Password.createToLogin(passwordPlainValue);

    const user = await this.userRepository.findByEmail(email);

    // Eメールアドレスと一致する登録済みユーザーが存在しないとき
    if (!user) {
      return { isSucceeded: false };
    }
    
    // Eメールアドレスもパスワードも一致するとき
    if (user.canLogin(email, password)) {
      return { isSucceeded: true, userName: user.name.value };
    }

    // パスワードが一致しないとき
    return { isSucceeded: false };
  }
}
