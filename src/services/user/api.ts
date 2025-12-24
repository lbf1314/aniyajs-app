import { queryPost, queryAsyncGet, queryUpload } from '@/utils/api';

// 获取用户信息
export const getUserInfo = async (): Promise<UserTypes.UserInfoReturn> => {
  return new Promise((resolve, reject) => {
    queryAsyncGet('/sys/currentUser').then(res => {
      if (res?.code === 200) {
        resolve(res?.result)
      } else {
        reject(false)
      }
    })
  })
}

// 获取验证码
export const getCode = async (): Promise<KeyValue> => {
  return new Promise((resolve, reject) => {
    queryAsyncGet('/sys/getCaptcha').then(res => {
      if (res?.code === 200) {
        resolve(res?.result)
      } else {
        reject(res?.message || "获取验证码失败")
      }
    })
  })
}

// 登录
export const login = async (data: UserTypes.AccountLoginRegistReq): Promise<{ token: string }> => {
  return new Promise((resolve, reject) => {
    queryPost('/sys/accountLogin', data).then(res => {
      if (res?.code === 200) {
        resolve(res?.result)
      } else {
        reject(res?.message || "账号密码错误")
      }
    })
  })
}

// 注册
export const register = async (data: Partial<UserTypes.AccountLoginRegistReq>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/sys/register', data);
}

// 修改密码
export const updatePassword = async (data: Partial<UserTypes.UpdatePasswordType>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/sys/updatePassword', data);
}

// 修改用户信息
export const updateUserInfo = async (data: Partial<UserTypes.UserInfoType>): Promise<Partial<UserTypes.UserInfoType>> => {
  return new Promise((resolve, reject) => {
    queryPost('/sys/updateUserInfo', data).then(res => {
      if (res?.code === 200) {
        resolve(res?.result)
      } else {
        reject(res?.message || "修改用户信息失败")
      }
    })
  })
}

// 修改头像
export const updateAvatar = async (data: FormData): Promise<Partial<UserTypes.UserInfoType>> => {
  return new Promise((resolve, reject) => {
    queryUpload('/sys/updateAvatar', data).then(res => {
      if (res?.code === 200) {
        resolve(res?.result)
      } else {
        reject(res?.message || "修改头像失败")
      }
    })
  })
}

// 修改邮箱
export const updateEmail = async (data: Partial<UserTypes.UpdateEmailReq>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/sys/updateEmail', data)
}

// 获取邮箱验证码
export const sendVerificationCode = async (data: { email: string }): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/sys/sendVerificationCode', data)
}

// 邮箱登录
export const emailLogin = async (data: Partial<UserTypes.EmailLoginReq>): Promise<API.InterfaceResult<Array<UserTypes.LoginResult>>> => {
  return queryPost('/sys/emailLogin', data)
}

// 获取账户列表
export const getAccountList = async (): Promise<API.InterfaceResult<Array<UserTypes.LoginResult>>> => {
  return queryAsyncGet('/sys/accountList')
}