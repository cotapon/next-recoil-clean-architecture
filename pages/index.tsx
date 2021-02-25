import {NextPage} from "next";
import {useUser} from "../state/useUser";
import {userUseCase} from "../domain/usecase";

const IndexPage:NextPage = () => {
  const { user, updateUser } = useUser(userUseCase)

  const handleSubmit = async () => {
    if (user) {
      await updateUser(user.uid, 'emailaddress')
    }
  }

  return (
    <>
      <h1>Hello {user} 👋</h1>
    </>
  )
}


export default IndexPage
