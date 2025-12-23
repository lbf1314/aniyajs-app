declare namespace WallpaperTypes {
  interface WallpaperItemProps {
    id: string; // 图集id
    title: string; // 图集名称
    thumbnail: string; // 缩略图
    tags: string[]; // 所属标签
    accountId: string; // 上传者账号id
    updatedAt: string; // 更新时间
    auditId: string; // 审核单id
  }

  interface WallpaperDetailInfoProps {
    id: string; // 图集id
    title: string; // 图集名称
    thumbnail: string; // 缩略图
    tags: string[]; // 所属标签
    remark: string; // 简介
    imgUrls: Array<{ imgUrl: string; hot: number, id: string }>; // 图片url集合
  }

  interface AuditListWallpaperItemProps {
    id: string; // 审核单ID
    status: StatusTypeEnum; // 审核状态
    title: string; // 图集名称
    tags: string[]; // 所属标签
    accountId: string; // 审核人账号ID
    createId: string; // 提交人账号ID
    createdAt: string; // 创建时间
  }
  
  interface WallpaperAuditDetailProps {
    id: string; // 审核单id
    status: StatusTypeEnum; // 审核状态
    aduitText: string; // 审核结果
    imgUrls: any; // 图片url集合
    title: string; // 图集名称
    thumbnail: any; // 缩略图
    tags: string[] | []; // 所属标签
    remark: string; // 简介
    deleteImgIds: string[]; // 删除的图片id集合
    wallpaperId: string; // 图集id
    createId: string; // 创建者id
    updateKeys: string[] | []; // 修改的key集合
  }
}
