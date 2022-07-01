import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { UrlToken } from '../domain/shared/UrlToken';
import { IUserRepository } from '../domain/user/IUserRepository';
import { User } from '../domain/user/User';
import { Password } from '../domain/user/Password';
import { UserName } from '../domain/user/UserName';

type Result = {
  ok: false;
  reason: 'expired'
} | {
  ok: true;
}

export class CreateUserUseCase {
  constructor(
    private readonly tempUserRepository: ITempUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  readonly execute = async (argsObj: {
    userNameValue: string;
    urlTokenValue: string;
    password1: string;
    password2: string;
  }): Promise<Result> => {
    const urlToken = UrlToken.reconstruct(argsObj.urlTokenValue);
    const tempUser = await this.tempUserRepository.findByUrlToken(urlToken);

    // 仮登録ユーザーが存在しないとき
    if (!tempUser) {
      return { ok: false, reason: 'expired' };
    }

    // 期限切れのとき
    if (tempUser.isExpired()) {
      this.tempUserRepository.delete(tempUser);
      return { ok: false, reason: 'expired' };
    }

    // 登録済みユーザーを作成し永続化する
    const userName = UserName.create(argsObj.userNameValue);
    const password = Password.create(argsObj.password1, argsObj.password2);
    const user = User.create(userName, tempUser.email, password);
    await this.userRepository.insert(user);

    this.tempUserRepository.delete(tempUser);

    return { ok: true };
  };
}
