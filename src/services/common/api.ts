import { queryGet, queryUpload } from "@/utils/api"

// 上传文件
export const uploadFileSync = (data: FormData): Promise<API.InterfaceResult<CommonTypes.UploadedFileResType>> => {
  return queryUpload('/common/uploadFile', data);
};

// 获取枚举数据
export const enumSync = (params: { type: string }): Promise<CommonTypes.EnumTypes> => {
  return new Promise((resolve, reject) => {
    queryGet('/common/enum', params).then(res => {
      if (res?.code === 200) {
        resolve(res?.result ?? []);
      } else {
        resolve([]);
      }
    }).catch(err => {
      resolve([]);
    });
  });
};  