import UserModel from "./User"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const AuthToken = AuthTokenModel(sequelize, User)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )

  return {
    User,
    AuthToken,
    AccountConfirmationToken,
  }
}
