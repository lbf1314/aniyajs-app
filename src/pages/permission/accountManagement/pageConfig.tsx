import React from 'react';
import type { ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
import api from '@/services/roleManagement';

export interface pageConfigProps {
}

export interface PageConfigTypes {
  tableColumns: ProColumns<AccountManagementTypes.AccountManagementItem>[];
  detailFormItems: ProFormColumnsType<AccountManagementTypes.AccountManagementItem>[];
}

function pageConfig({ }: pageConfigProps): PageConfigTypes {
  return {
    tableColumns: [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
        render: (_, __, index, action) => {
          const { current = 1, pageSize = 10 } = action?.pageInfo || {};
          const realIndex = (current - 1) * pageSize + index + 1;

          return realIndex;
        },
      },
      {
        title: '账号',
        dataIndex: 'account',
        ellipsis: true,
        fieldProps: {
          minLength: 4,
          maxLength: 10,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入账号',
            },
            {
              min: 4,
              message: '长度不能小于4位',
            },
            {
              max: 10,
              message: '长度不能大于10位',
            },
          ],
        }
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        copyable: true,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请输入正确的邮箱',
            },
          ],
        }
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        ellipsis: true,
        valueType: "select",
        request: async () => {
          const res = await api.getRoleEnum();
          if (res?.code === 200) {
            return res?.result?.map(item => ({
              label: item?.roleName,
              value: item?.roleId,
            }))
          } else {
            return []
          }
        },
      },
      {
        title: '是否锁定',
        dataIndex: 'isLock',
        ellipsis: true,
        valueType: 'select',
        width: 120,
        valueEnum: {
          1: {
            text: '锁定',
            status: 'Error',
          },
          0: {
            text: '正常',
            status: 'Success',
          },
        },
        fieldProps: {
          allowClear: false
        }
      },
      {
        title: '修改人',
        dataIndex: 'operator',
        ellipsis: true,
        search: false,
        editable: false,
      },
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
        ellipsis: true,
        search: false,
        valueType: 'dateTime',
        editable: false,
        width: 160
      },
    ],
    detailFormItems: [
      {
        valueType: 'divider',
      },
      {
        title: '账号',
        dataIndex: 'account',
        colProps: {
          span: 12,
        },
        fieldProps: {
          minLength: 4,
          maxLength: 10,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入登录账号',
            },
            {
              min: 4,
              message: '长度不能小于4位',
            },
            {
              max: 10,
              message: '长度不能大于10位',
            },
          ],
        }
      },
      {
        title: '是否锁定',
        dataIndex: 'isLock',
        colProps: {
          span: 12,
        },
        fieldProps: {
          allowClear: false
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        valueType: 'select',
        valueEnum: {
          1: {
            text: '锁定',
            status: 'Error',
          },
          0: {
            text: '正常',
            status: 'Success',
          },
        },
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        colProps: {
          span: 12,
        },
        valueType: 'select',
        request: async () => {
          const res = await api.getRoleEnum();
          if (res?.code === 200) {
            return res?.result?.map(item => ({
              label: item?.roleName,
              value: item?.roleId,
            }))
          } else {
            return []
          }
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        colProps: {
          span: 12,
        },
        formItemProps: {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请输入正确的邮箱',
            },
          ],
        }
      },
      {
        valueType: 'divider',
      },
    ]
  }
}

export default pageConfig;