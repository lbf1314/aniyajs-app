declare namespace UserTypes {
  interface UserInfoType {
    account: string;
    accountId: string;
    nickname: string;
    name: string;
    sex: string;
    email: string;
    avatar: string;
    remark: string;
    createdAt: string;
    id: string;
  }

  interface MenuItemType {
    id: string;
    parentId?: string;
    name: string;
    icon?: string;
    menuType: string;
    path: string;
    isHide: "1" | "0";
    order: number;
    createdAt: string;
    updatedAt: string;
    remark?: string;
    permission?: string;
    routes?: Array<MenuItemType>
  }
  
  interface UserInfoReturn {
    userInfo: Partial<UserInfoType>;
    menus: Array<MenuItemType>;
    doms: Array<MenuItemType>;
  }

  interface AccountLoginRegistReq {
    account?: string;
    password?: string;
    captcha?: string;
  }

  interface UpdatePasswordType {
    new: string;
    last: string;
  }

  interface UpdateEmailReq {
    lastEmail: string;
    newEmail: string;
    captcha: string;
  }

  interface EmailLoginReq {
    email?: string;
    captcha?: string;
  }

  interface LoginResult {
    account: string;
    avatar: string;
    id: string;
    token: string;
  }
}