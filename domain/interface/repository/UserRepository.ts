import {User} from "../../entity/user";

export interface UserRepository {
  find(uid: string): Promise<User | null>;
  update(uid: string, email: string): Promise<void>;
}

