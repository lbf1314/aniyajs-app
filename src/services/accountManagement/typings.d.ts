declare namespace AccountManagementTypes {
  interface AccountManagementItem {
    account: string;
    updatedAt: string;
    email: string;
    operator: string;
    isLock: "1" | "0";
    roleId: string;
    id: string;
    roleName: string;
  }
}