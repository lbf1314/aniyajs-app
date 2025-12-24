declare namespace RoleManagementTypes {
  interface RoleManagementItem {
    menus: string[] | [],
    operator: string;
    remark: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    roleName: string;
  }

  interface RoleEnumItem {
    roleId: string;
    roleName: string;
  }
}