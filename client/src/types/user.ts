export interface IUserData {
  _id?: string
  username: string
  permissions: string
  createdAt?: Date
  updatedAt?: Date
  __v?: number
}

export interface UserLogin {
  username: string
  password: string
}

export interface UserRegister {
  username: string
  password: string
  permissions?: string
}
