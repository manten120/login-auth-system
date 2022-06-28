import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { UrlToken } from '../domain/tempUser/UrlToken';

export class CheckUrlTokenUseCase {
  constructor(private readonly tempUserRepository: ITempUserRepository) {}

  readonly execute = async (urlTokenValue: string) => {
    const urlToken = UrlToken.reconstruct(urlTokenValue);

    const tempUser = await this.tempUserRepository.findByUrlToken(urlToken);

    if (!tempUser) {
      return { ok: false, reason: 'notExist' };
    }

    if (tempUser.isExpired()) {
      return { ok: false, reason: 'expired' };
    }

    return { ok: true, reason: '' };
  };
}
