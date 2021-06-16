import UserModel from "./User"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"
import AssetModel from "./Asset"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const AuthToken = AuthTokenModel(sequelize, User)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )
  const Asset = AssetModel(sequelize)

  return {
    User,
    AuthToken,
    AccountConfirmationToken,
    Asset,
  }
}
