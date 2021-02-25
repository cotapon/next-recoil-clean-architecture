export class User {
  readonly uid: string;

  readonly email: string

  constructor(uid: string, email: string) {
    this.uid = uid;
    this.email = email
  }
}
