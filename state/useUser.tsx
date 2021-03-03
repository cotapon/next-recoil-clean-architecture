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
