import { CreateTempUserService } from "../domain/service/CreateTempUserService";

export class CreateTempUserUseCase {
  constructor(private readonly createTempUserService: CreateTempUserService){}

  readonly execute = async (emailPlainValue: string) => {
    await this.createTempUserService.execute(emailPlainValue);

  }
}