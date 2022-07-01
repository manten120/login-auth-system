import { ITempUserRepository } from '../domain/tempUser/ITempUserRepository';
import { UrlToken } from '../domain/shared/UrlToken';

type Result = {
  ok: true;
} | {
  ok: false;
  reason: 'tempUserNotExist' | 'expired'
}

export class CheckUrlTokenUseCase {
  constructor(private readonly tempUserRepository: ITempUserRepository) {}

  readonly execute = async (urlTokenValue: string): Promise<Result> => {
    const urlToken = UrlToken.reconstruct(urlTokenValue);

    const tempUser = await this.tempUserRepository.findByUrlToken(urlToken);

    if (!tempUser) {
      return { ok: false, reason: 'tempUserNotExist' };
    }

    if (tempUser.isExpired()) {
      return { ok: false, reason: 'expired' };
    }

    return { ok: true };
  };
}
