declare namespace MenuManagementTypes {
  interface MenuManagementData {
    name: string;
    icon?: string;
    path?: string;
    order: number;
    permission?: string;
    remark?: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    parentId?: string;
    menuType: string;
    isHide: "1" | "0";
    children: MenuManagementData[] | []
  }
}