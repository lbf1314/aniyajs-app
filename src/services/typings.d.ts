declare namespace API {
  /**
   * 默认接口返回结构
   */
  type InterfaceResult<T> = {
    result: T;
    code: number;
    message: string;
  };

  // 列表接口请求结构
  type ReqListData<T> = T & {
    current?: number;
    pageSize?: number;
  }

  // 列表接口返回结构
  type ResListData<T> = {
    data: T[];
    success?: boolean;
    total?: number;
  }

  // 图片上传请求
  type UploadFileReq = {
    file: File;
    type: string;
  }
}
