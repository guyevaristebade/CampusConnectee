export interface IUserData {
  _id?: string
  username: string
  permissions: string
}

export interface UserLogin {
  username: string
  password: string
}
