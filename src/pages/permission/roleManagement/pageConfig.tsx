import React from 'react';
import { type ProColumns, type ProFormColumnsType } from '@ant-design/pro-components';
import { ATree } from '@aniyajs/components';
import type { DataNode } from 'antd/lib/tree/index';

export interface pageConfigProps {
  treeData: DataNode[];
}

export interface PageConfigTypes {
  tableColumns: ProColumns<RoleManagementTypes.RoleManagementItem>[];
  detailFormItems: ProFormColumnsType<RoleManagementTypes.RoleManagementItem>[];
}

function pageConfig({ treeData }: pageConfigProps): PageConfigTypes {
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
        title: '角色名称',
        dataIndex: 'roleName',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
        ellipsis: true,
        search: false,
        width: 160
      },
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
        valueType: 'dateTime',
        ellipsis: true,
        search: false,
        width: 160
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        ellipsis: true,
        search: false,
        editable: false,
      },

    ],
    detailFormItems: [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入角色名称',
            },
          ],
        }
      },
      {
        title: '菜单权限',
        dataIndex: 'menus',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择菜单权限',
            },
          ],
        },
        renderFormItem(schema, config, form, action) {
          return (
            <ATree
              name='menus'
              widgetProps={{
                blockNode: true,
                checkable: true,
                checkStrictly: true,
              }}
              treeData={treeData}
              checkStrictlyChecked={true}
              formItemProps={{
                style: {
                  marginBottom: 0,
                },
                labelCol: { span: 0 },
                wrapperCol: { span: 24 },
              }}
            />
          )
        },
        colProps: {
          span: 24,
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: "textarea",
        fieldProps: {
          autoSize: { minRows: 5, maxRows: 10 },
        },
        colProps: {
          span: 24,
        },
      }
    ]
  }
}

export default pageConfig;