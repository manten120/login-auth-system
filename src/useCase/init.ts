import { TempUserRepository } from '../infra/repository/TempUserRepository';
import { UserRepository } from '../infra/repository/UserRepository';
import { CreateTempUserUseCase } from '../useCase/CreateTempUserUseCase';
import { mailer } from '../infra/Mailer';
import { CheckUrlTokenUseCase } from '../useCase/CheckUrlTokenUseCase';
import { CreateUserUseCase } from '../useCase/CreateUserUseCase';
import { LoginUseCase } from './LoginUseCase';

const tempUserRepository = new TempUserRepository();
const userRepository = new UserRepository();

export const createTempUserUseCase = new CreateTempUserUseCase(userRepository, tempUserRepository, mailer);
export const checkUrlTokenUseCase = new CheckUrlTokenUseCase(tempUserRepository);
export const createUserUseCase = new CreateUserUseCase(tempUserRepository, userRepository);
export const loginUseCase = new LoginUseCase(userRepository);
