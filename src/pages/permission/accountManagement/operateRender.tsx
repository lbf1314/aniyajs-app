import React from 'react';
import { Button, Form } from 'antd';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';
import { iconMap } from '@/utils/constant';

export interface ToolBarRenderProps {
  createHandle?: (values: AccountManagementTypes.AccountManagementItem, callback: () => void) => void;
  detailFormItems: ProFormColumnsType<AccountManagementTypes.AccountManagementItem>[];
}

export const operateRender = (props: ToolBarRenderProps) => {
  const [form] = Form.useForm<AccountManagementTypes.AccountManagementItem>();
  const { createHandle, detailFormItems } = props;

  const onFinish = async (values: AccountManagementTypes.AccountManagementItem) => {
    if (createHandle) {
      createHandle?.(values, () => {
        form?.resetFields();
      })

      return true;
    }
  };

  return ([
    <BetaSchemaForm<AccountManagementTypes.AccountManagementItem>
      title={"新建账号"}
      form={form}
      trigger={(
        <Button
          key="button"
          icon={iconMap('PlusOutlined')}
          type="primary"
        >
          新建
        </Button>
      )}
      grid={true}
      layoutType="ModalForm"
      onFinish={onFinish}
      modalProps={{
        destroyOnHidden: true,
      }}
      columns={detailFormItems}
    />
  ])
}