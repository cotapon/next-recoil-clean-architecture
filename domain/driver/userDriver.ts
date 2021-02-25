export interface UserDriver {
  find(uid: string): Promise<UserModel | null>;
  update(uid: string, email: string): Promise<void>;
}

type UserModel = {
  uid: string;
  email: string;
};

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
