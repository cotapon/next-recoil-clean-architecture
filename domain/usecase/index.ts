import { UserRepositoryImpl } from "../repository/userRepository";
import { UserDriverImpl } from "../driver/userDriver";
import { UserUseCaseImpl } from "./userUseCase";

const userRepository = new UserRepositoryImpl(new UserDriverImpl());

export const userUseCase = new UserUseCaseImpl(userRepository);

