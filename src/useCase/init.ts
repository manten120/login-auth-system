import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { ForgottenUserRepository } from '../infra/repository/ForgottenUserRepository';
import { RegisterTempUserUseCase } from '../useCase/RegisterTempUserUseCase';
import { mailer } from '../infra/Mailer';
import { CheckUrlTokenUseCase } from '../useCase/CheckUrlTokenUseCase';
import { RegisterUserUseCase } from '../useCase/RegisterUserUseCase';
import { LoginUseCase } from './LoginUseCase';
import { SendEmailToChangePasswordUseCase } from './SendEmailToChangePassword';
import { CheckUrlTokenToChangePasswordUseCase } from './CheckUrlTokenToChangePasswordUseCase';
import { ChangePasswordUseCase } from './ChangePasswordUseCase';

const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();
const forgottenUserRepository = new ForgottenUserRepository();

export const registerTempUserUseCase = new RegisterTempUserUseCase(userRepository, tempUserRepository, mailer);
export const checkUrlTokenUseCase = new CheckUrlTokenUseCase(tempUserRepository);
export const registerUserUseCase = new RegisterUserUseCase(tempUserRepository, userRepository);
export const loginUseCase = new LoginUseCase(userRepository);
export const sendEmailToChangePasswordUseCase = new SendEmailToChangePasswordUseCase(
  userRepository,
  forgottenUserRepository,
  mailer
);
export const checkUrlTokenToChangePasswordUseCase = new CheckUrlTokenToChangePasswordUseCase(forgottenUserRepository);
export const changePasswordUseCase = new ChangePasswordUseCase(forgottenUserRepository, userRepository);
