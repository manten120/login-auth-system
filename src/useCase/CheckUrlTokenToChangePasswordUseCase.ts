import { IForgottenUserRepository } from '../domain/forgottenUser/IForgottenUserRepository';
import { UrlToken } from '../domain/shared/UrlToken';

type Result = { 
  ok: true;
} | {
  ok: false;
  reason: 'notExist' | 'expired';
}

export class CheckUrlTokenToChangePasswordUseCase {
  constructor(private readonly forgottenUserRepository: IForgottenUserRepository) {}

  readonly execute = async (urlTokenValue: string): Promise<Result> => {
    const urlToken = UrlToken.reconstruct(urlTokenValue);

    const forgottenUser = await this.forgottenUserRepository.findByUrlToken(urlToken);

    if (!forgottenUser) {
      return { ok: false, reason: 'notExist' };
    }

    if (forgottenUser.isExpired()) {
      return { ok: false, reason: 'expired' };
    }

    return { ok: true };
  };
}
