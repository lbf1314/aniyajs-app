import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { operateRender } from './operateRender';
import pageConfig from './pageConfig';
import api from '@/services/accountManagement';
import actionRender from './actionRender';
import { OperatorKeys, OperatorType } from './interface';

const operatorTypeDic: OperatorType = {
  add: '新建',
  update: '修改',
  delete: '删除',
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();

  const operatorHandle = async (type: OperatorKeys, row: AccountManagementTypes.AccountManagementItem, successCallback?: () => void) => {
    try {
      const result = await api[`${type}Account`](row);
      if (result?.code === 200) {
        message.success(`${operatorTypeDic[type]}成功`);
        actionRef.current?.reload();
        if (successCallback) {
          successCallback();
        }
        return true;
      } else {
        message.error(result?.message || `${operatorTypeDic[type]}失败`);
        actionRef.current?.reload();
        return false;
      }
    } catch (error) {
      message.error(`${operatorTypeDic[type]}失败`);
      actionRef.current?.reload();
      return false;
    }
  }

  const resetPasswordHandle = async (id: string) => {
    try {
      const result = await api.resetPassword({ id });
      if (result?.code === 200) {
        message.success("密码已重置");
        return true;
      } else {
        message.error(result?.message || "重置失败");
        return false;
      }
    } catch (error) {
      message.error("重置失败");
      return false;
    }
  }

  const extraTableColumnRender = (): ProColumns<AccountManagementTypes.AccountManagementItem>[] => {
    return [
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (_, record, __, action) => {
          return [
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
              }}
            >
              编辑
            </a>,
            <Popconfirm
              title="重置密码"
              onConfirm={() => resetPasswordHandle?.(record?.id)}
              okText="确认"
              cancelText="取消"
            >
              <a
                key="resetPassword"
              >
                重置密码
              </a>
            </Popconfirm>
          ]
        }
      },
    ]
  };

  const { tableColumns, detailFormItems } = pageConfig({});

  return (
    <ProTable<AccountManagementTypes.AccountManagementItem>
      columns={[...tableColumns, ...extraTableColumnRender()]}
      actionRef={actionRef}
      cardBordered
      request={async (params) => {
        return api.getList(params)
      }}
      editable={{
        type: 'multiple',
        onSave: (_, row) => operatorHandle('update', row),
        onDelete: (_, row) => operatorHandle('delete', row),
        actionRender,
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      headerTitle={false}
      toolBarRender={() => operateRender({ createHandle: (values, successCallback) => operatorHandle('add', values, successCallback), detailFormItems })}
    />
  );
};