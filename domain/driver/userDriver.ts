import { UserDriver, UserModel } from "../interface/driver/UserDriver";

export class UserDriverImpl implements UserDriver {
  private readonly db;

  constructor(database: any = null) {
    this.db = database;
  }

  async find(uid: string): Promise<UserModel | null> {
    const doc = await this.db.collection('user').doc(uid).get();

    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }
  
  async update(uid: string, email: string): Promise<void> {
    await this.db.collection('user').doc(uid).update({ email });
  }
}
