export interface UserDriver {
  find(uid: string): Promise<UserModel | null>;
  update(uid: string, email: string): Promise<void>;
}

export type UserModel = {
  uid: string;
  email: string;
};

