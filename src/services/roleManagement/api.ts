import { queryAsyncGet, queryDelete, queryPost } from "@/utils/api"

// 列表
export const getList = async (data: API.ReqListData<Partial<RoleManagementTypes.RoleManagementItem>>): Promise<API.ResListData<RoleManagementTypes.RoleManagementItem>> => {
  return new Promise((resolve, reject) => {
    queryPost('authoritManagement/role/list', data).then(res => {
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
export const addRole = async (data: Partial<RoleManagementTypes.RoleManagementItem>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/authoritManagement/role/add', data)
}

// 修改
export const updateRole = async (data: Partial<RoleManagementTypes.RoleManagementItem>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/authoritManagement/role/update', data);
}

// 删除
export const deleteRole = async (data: { id: string } ): Promise<API.InterfaceResult<boolean>> => {
  return queryDelete('/authoritManagement/role/delete', data)
}

// 角色枚举接口
export const getRoleEnum = async (): Promise<API.InterfaceResult< RoleManagementTypes.RoleEnumItem[] | []>> => {
  return queryAsyncGet('authoritManagement/role/roleEnum')
}
