import { User } from "../entity/user";
import { UserRepository } from "../interface/repository/UserRepository";
import { UserUseCase } from "../interface/usecase/UserUseCase";

export class UserUseCaseImpl implements UserUseCase {
  readonly userRepository: UserRepository;

  constructor(repository: UserRepository) {
    this.userRepository = repository;
  }

  async find(uid: string): Promise<User | null> {
    return this.userRepository.find(uid);
  }

  async update(uid: string, email: string): Promise<void> {
    await this.userRepository.update(uid, email);
  }
}
