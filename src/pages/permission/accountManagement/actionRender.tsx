import React from 'react';
import { ActionRenderConfig } from '@ant-design/pro-utils/es/useEditableArray';

function actionRender(row: AccountManagementTypes.AccountManagementItem, config: ActionRenderConfig<AccountManagementTypes.AccountManagementItem>, defaultDoms: {
  save: React.ReactNode;
  delete: React.ReactNode;
  cancel: React.ReactNode;
}) {
  return ([
    defaultDoms.save,
    defaultDoms.delete,
    <a key="cancel" onClick={(e) => {
      e.stopPropagation();
      const rowKeys = config?.editableKeys || [];

      if (rowKeys.includes(row?.id)) {
        config?.setEditableRowKeys(rowKeys.filter(key => key !== row?.id))
      }
    }}>取消</a>
  ])
}

export default actionRender;