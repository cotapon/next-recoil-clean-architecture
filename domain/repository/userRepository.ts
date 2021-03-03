import { User } from "../entity/user";
import { UserDriver } from "../driver/userDriver";
import { UserRepository } from "../interface/repository/UserRepository";

export class UserRepositoryImpl implements UserRepository {
  private readonly userDriver: UserDriver;

  constructor(driver: UserDriver) {
    this.userDriver = driver;
  }

  async find(uid: string): Promise<User | null> {
    const res = await this.userDriver.find(uid);
    return res ? new User(res.uid, res.email) : null;
  }
  
  async update(uid: string, email: string): Promise<void> {
    await this.userDriver.update(uid, email);
  }
}
