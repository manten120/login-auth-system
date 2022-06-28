import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { UrlToken } from '../domain/tempUser/UrlToken';
import { IUserRepository } from '../domain/user/IUserRepository';
import { Password } from '../domain/user/Password';
import { User } from '../domain/user/User';
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

    // 仮登録ユーザーが存在しないまたは期限切れのとき
    if (!tempUser || tempUser.isExpired()) {
      return { ok: false, reason: 'expired' };
    }

    // ユーザーを作成し永続化する
    const userName = UserName.create(argsObj.userNameValue);
    const password = Password.create(argsObj.password1, argsObj.password2);
    const user = User.create(userName, tempUser.email, password);
    await this.userRepository.insert(user);

    // TODO: awaitする必要ある?
    await this.tempUserRepository.delete(tempUser);

    return { ok: true };
  };
}
