import { ITempUserRepository } from "../domain/tempUser/ITempUserRepository";
import { UrlToken } from "../domain/tempUser/UrlToken";

// export class CheckUrlTokenUseCase {
//   constructor(
//     private readonly tempUserRepository: ITempUserRepository
//   ){}

//   readonly execute = async (urlTokenValue: string) => {
//     try {
//       const urlToken = UrlToken.reconstruct(urlTokenValue);

//       return const tempUser = await this.tempUserRepository.findByToken(urlToken);

//       if (!tempUser) {
//         return { ok: false, reason: 'notExist', message: '' };
//       }

//       if (tempUser.isExpired()) {
//         return { ok: false, reason: 'expired', message: '' };
//       }

//     return { ok: true, reason: '', message: '' };
//     } catch(e) {};
//   }
// }