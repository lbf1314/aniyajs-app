import { queryDelete, queryPost } from "@/utils/api"

// 新增&修改壁纸集
export const addUpdateSync = (data: Partial<WallpaperTypes.WallpaperAuditDetailProps>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/happyHodgepodge/wallpaper/addUpdate', data);
};

// 删除壁纸集
export const deleteSync = (data: Partial<WallpaperTypes.WallpaperItemProps>): Promise<API.InterfaceResult<boolean>> => {
  return queryDelete('/happyHodgepodge/wallpaper/delete', data);
};

// 壁纸集列表
export const listSync = (data: API.ReqListData<Partial<WallpaperTypes.WallpaperItemProps>>): Promise<API.ResListData<WallpaperTypes.WallpaperItemProps>> => {
  return new Promise((resolve, reject) => {
    queryPost('/happyHodgepodge/wallpaper/list', data).then(res => {
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
};

// 查看壁纸集详情
export const detailInfoSync = (data: Partial<WallpaperTypes.WallpaperItemProps>): Promise<API.InterfaceResult<WallpaperTypes.WallpaperDetailInfoProps>> => {
  return queryPost('/happyHodgepodge/wallpaper/detailInfo', data);
};

// 审核列表
export const auditListSync = (data: API.ReqListData<Partial<WallpaperTypes.AuditListWallpaperItemProps>>): Promise<API.ResListData<WallpaperTypes.AuditListWallpaperItemProps>> => {
  return new Promise((resolve, reject) => {
    queryPost('/happyHodgepodge/wallpaper/auditList', data).then(res => {
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
};

// 查看审核详情
export const auditDetailSync = (data: Partial<WallpaperTypes.AuditListWallpaperItemProps>): Promise<API.InterfaceResult<WallpaperTypes.WallpaperAuditDetailProps>> => {
  return queryPost('/happyHodgepodge/wallpaper/auditDetail', data);
};

// 提交审核
export const auditSaveSync = (data: Partial<WallpaperTypes.WallpaperAuditDetailProps>): Promise<API.InterfaceResult<boolean>> => {
  return queryPost('/happyHodgepodge/wallpaper/auditSave', data);
};