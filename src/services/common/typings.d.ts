declare namespace CommonTypes {
  interface UploadPayload {
    type: string;
    files: RcFile[];
  }

  interface UploadFileType {
    url: string;
    path: string;
  }

  interface UploadFileErrorType {
    order: number;
    filename: string;
    message: string;
  }

  interface UploadedFileResType {
    data: UploadFileType[] | [];
    errors: UploadFileErrorType[] | [];
  }

  interface EnumType {
    value: string;
    text: string;
  }

  type EnumTypes = Array<CommonTypes.EnumType>;
}