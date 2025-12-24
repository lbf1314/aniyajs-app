import { queryDelete, queryPost } from "@/utils/api"

// 列表
export const getList = async (data: API.ReqListData<Partial<AccountManagementTypes.AccountManagementItem>>): Promise<API.ResListData<AccountManagementTypes.AccountManagementItem>> => {
  return new Promise((resolve, reject) => {
    queryPost('/authoritManagement/account/list', data).then(res => {
      if (res?.code === 200) {
        const result = res?.result ?? {}
        resolve(result)
      } else {
        resolve({
          data: [],
          success: false,
          total: 0
        })
      }
    })
  })
}

// 新增
export const addAccount = async (data: Partial<AccountManagementTypes.AccountManagementItem>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/authoritManagement/account/add', data)
}

// 修改
export const updateAccount = async (data: Partial<AccountManagementTypes.AccountManagementItem>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/authoritManagement/account/update', data);
}

// 删除
export const deleteAccount = async (data: { id: string } ): Promise<API.InterfaceResult<boolean>> => {
  return queryDelete('/authoritManagement/account/delete', data)
}

// 重置密码
export const resetPassword = async (data: { id: string }): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/authoritManagement/account/resetPassword', data)
}