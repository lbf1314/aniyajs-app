import React from 'react';
import { Form } from 'antd';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';
import { OperatorKeys, OperatorType } from './interface';

export interface OperateRenderProps {
  type: OperatorKeys;
  operatorTypeDic: OperatorType;
  trigger: JSX.Element;
  onOpenChange?: (visible: boolean) => void;
  saveHandle?: (values: RoleManagementTypes.RoleManagementItem, callback: () => void) => void;
  record?: RoleManagementTypes.RoleManagementItem;
  detailFormItems: ProFormColumnsType<RoleManagementTypes.RoleManagementItem>[];
}

const OperateRender: React.FC<OperateRenderProps> = (props, ref) => {
  const [form] = Form.useForm<RoleManagementTypes.RoleManagementItem>();
  const { saveHandle, onOpenChange, detailFormItems, operatorTypeDic, type, trigger, record = {} } = props;

  const onFinish = async (values: RoleManagementTypes.RoleManagementItem) => {
    if (saveHandle) {
      saveHandle?.(values, () => {
        form?.resetFields();
      })

      return true;
    }
  };

  return (
    <BetaSchemaForm<RoleManagementTypes.RoleManagementItem>
      title={`${operatorTypeDic[type]}角色`}
      width={600}
      form={form}
      trigger={trigger}
      grid={true}
      layoutType="DrawerForm"
      onOpenChange={(visible) => {
        if (onOpenChange) {
          onOpenChange(visible)
        }
        if (visible) {
          if (type === 'update') {
            form?.setFieldsValue({
              ...record
            })
          }
        } else {
          form?.resetFields();
        }
      }}
      onFinish={onFinish}
      drawerProps={{
        destroyOnHidden: true,
      }}
      columns={detailFormItems}
    />
  )
}

export default OperateRender;