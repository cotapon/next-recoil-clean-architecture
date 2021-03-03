# Recoil + Clean Architecture ? DDD ?

```
domain/
├── driver
│   └── userDriver.ts
├── entity
│   └── user.ts
├── interface
│   ├── driver
│   │   └── UserDriver.ts
│   ├── repository
│   │   └── UserRepository.ts
│   └── usecase
│       └── UserUseCase.ts
├── repository
│   └── userRepository.ts
├── usecase
│   ├── index.ts
│   └── userUseCase.ts
state/
└── useUser.tsx    
```

## Entity

ドメインモデルで不変なオブジェクト

```typescript
// domain/entity/user.ts
export class User {
  readonly uid: string;

  readonly email: string

  constructor(uid: string, email: string) {
    this.uid = uid;
    this.email = email
  }
}
```


## UseCase

ドメインモデルを使ってビジネス手順のみを記載

```typescript
// domain/interface/usecase/userUseCase.ts
import { User } from "../../entity/user";

export interface UserUseCase {
  find(uid: string): Promise<User | null>;
  update(uid: string, email: string): Promise<void>;
}
```

```typescript
// domain/usecase/userUseCase.ts
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

```

## Repository

外部と内部をつなぐRepository層でアプリケーション固有のドメインモデルに変換する

```typescript
// domain/interface/repository/userRepository.ts
import {User} from "../../entity/user";

export interface UserRepository {
  find(uid: string): Promise<User | null>;
  update(uid: string, email: string): Promise<void>;
}
```

```typescript
// domain/repository/userRepository.ts
import { User } from "../entity/user";
import { UserRepository } from "../interface/repository/UserRepository";
import { UserDriver } from "../interface/driver/UserDriver";

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
```

## Driver

外部データを取得し、内容は変えずにレスポンスそのままを返する

```typescript
// domain/interface/driver/UserDriver.ts
export interface UserDriver {
  find(uid: string): Promise<UserModel | null>;
  update(uid: string, email: string): Promise<void>;
}

export type UserModel = {
  uid: string;
  email: string;
};
```

```typescript
// domain/driver/userDriver.ts
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
```

## Presenter (Recoil State)

UIへ反映させるためにReact Custom Hooksを使います。Global な state を使う場合は、Recoil を Hooks 内にカプセル化することによって、
Hooksを経由しないと状態を更新できなくし、state の安全性を担保しています。

```typescript
// domain/usecase/index.ts 
import { UserRepositoryImpl } from "../repository/userRepository";
import { UserDriverImpl } from "../driver/userDriver";
import { UserUseCaseImpl } from "./userUseCase";

const userRepository = new UserRepositoryImpl(new UserDriverImpl());

export const userUseCase = new UserUseCaseImpl(userRepository);

```

```typescript
// state/useUser.tsx
import {
  atom,
  useRecoilValue,
} from "recoil";
import { User } from "../domain/entity/user";
import { UserUseCase } from "../domain/interface/usecase/UserUseCase";

const UserAtom = atom<User | null>({
  key: "USER_ATOM",
  default: null,
});

export function useUser(useCase: UserUseCase) {
  const user = useRecoilValue(UserAtom);
  
  const findUser = async (uid: string): Promise<User | null> => {
    return useCase.find(uid);
  };
  
  const updateUser = async (uid: string, email: string): Promise<void> => {
    await useCase.update(uid, email);
  }
  
  return { user, findUser, updateUser };
}
```


### 参考
[https://qiita.com/ttiger55/items/50d88e9dbf3039d7ab66](https://qiita.com/ttiger55/items/50d88e9dbf3039d7ab66)

[https://blog.uhy.ooo/entry/2020-05-16/recoil-first-impression/](https://blog.uhy.ooo/entry/2020-05-16/recoil-first-impression/)
