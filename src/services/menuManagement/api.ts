import { queryAsyncPost, queryDelete, queryPost } from "@/utils/api"

// 列表
export const getMenuList = async (): Promise<API.ResListData<MenuManagementTypes.MenuManagementData>> => {
  return new Promise((resolve, reject) => {
    queryAsyncPost('authoritManagement/menu/tree').then(res => {
      if (res?.code === 200) {
        const result = res?.result ?? []

        resolve({
          data: result
        })
      } else {
        resolve({
          data: []
        })
      }
    })
  })
}

// 新增
export const addMenu = async (data: Partial<MenuManagementTypes.MenuManagementData>): Promise<API.InterfaceResult<MenuManagementTypes.MenuManagementData[] | []>> => {
  return queryPost('authoritManagement/menu/add', data)
}

// 修改
export const updateMenu = async (data: Partial<MenuManagementTypes.MenuManagementData>): Promise<API.InterfaceResult<MenuManagementTypes.MenuManagementData[] | []>> => {
  return queryPost('authoritManagement/menu/update', data)
}

// 删除
export const deleteMenu = async (data: { id: string } ): Promise<API.InterfaceResult<MenuManagementTypes.MenuManagementData[] | []>> => {
  return queryDelete('authoritManagement/menu/delete', data)
}

// 排序
export const orderMenu = async (data: Partial<MenuManagementTypes.MenuManagementData>): Promise<API.InterfaceResult<MenuManagementTypes.MenuManagementData[] | []>> => {
  return queryPost('authoritManagement/menu/order', data)
}