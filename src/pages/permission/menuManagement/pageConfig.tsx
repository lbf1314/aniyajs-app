import React from 'react';
import { type ProColumns, type ProFormColumnsType } from '@ant-design/pro-components';
import { ATree } from '@aniyajs/components';
import dictData from '@/utils/dictData';
import { Tag, Tooltip } from 'antd';
import { iconMap } from '@/utils/constant';

export interface pageConfigProps {
  search?: Record<string, any>;
  menuTypeSelectHandle?: (value: string) => void;
}

export interface PageConfigTypes {
  tableColumns: ProColumns<MenuManagementTypes.MenuManagementData>[];
  detailRootFormItems: ProFormColumnsType<MenuManagementTypes.MenuManagementData>[];
  detailMenuFormItems: ProFormColumnsType<MenuManagementTypes.MenuManagementData>[];
  detailNodeFormItems: ProFormColumnsType<MenuManagementTypes.MenuManagementData>[];
}

function pageConfig({ search = {}, menuTypeSelectHandle }: pageConfigProps): PageConfigTypes {
  return {
    tableColumns: [
      {
        title: '菜单名称',
        dataIndex: 'name',
        fieldProps: {
          placeholder: "请输入目录、菜单或节点名称"
        },
        ellipsis: true,
        render: (_, entity: MenuManagementTypes.MenuManagementData) => {
          return (
            <Tooltip title={entity?.name}>
              <span
                dangerouslySetInnerHTML={{
                  __html: entity?.name?.replace(
                    search?.name || '',
                    `<mark style="background-color: rgb(255, 192, 105); padding: 0px;">${search?.name || ''}</mark>`,
                  ),
                }}
              />
            </Tooltip>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'menuType',
        width: 70,
        search: false,
        ellipsis: true,
        render: (_, entity: MenuManagementTypes.MenuManagementData) => {
          const menuTypeInfo = dictData
            ?.find((k) => k?.dictName === 'menuTypeInfos')
            ?.dictInfo?.find((item: any) => item.value === entity?.menuType);
          return <Tag color={menuTypeInfo?.bgc}>{menuTypeInfo?.text}</Tag>;
        },
      },
      {
        title: '目标路径',
        dataIndex: 'path',
        search: false,
        ellipsis: true,
      },
      {
        title: '授权标识',
        dataIndex: 'permission',
        search: false,
        ellipsis: true,
      },
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
        valueType: "dateTime",
        search: false,
        ellipsis: true,
        width: 160
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: 60,
        search: false,
        align: 'center',
        ellipsis: true,
        render: (_, entity: MenuManagementTypes.MenuManagementData) => {
          return <div>{entity?.icon ? iconMap(entity?.icon) : null}</div>
        },
      },
      {
        title: '是否隐藏',
        dataIndex: 'isHide',
        width: 80,
        search: false,
        ellipsis: true,
        valueEnum: {
          1: {
            text: '是',
            status: 'Error',
          },
          0: {
            text: '否',
            status: 'Success',
          },
        },
      },
    ],
    // 新建头目录配置
    detailRootFormItems: [
      {
        title: '类型',
        dataIndex: 'menuType',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '目录',
            status: 'Success',
          },
          2: {
            text: '菜单',
            status: 'Success',
          },
        },
        initialValue: '1',
        colProps: {
          span: 24,
        },
        fieldProps: {
          onChange: (e) => menuTypeSelectHandle?.(e.target.value)
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择类型',
            },
          ],
        }
      },
      {
        title: '目录名称',
        dataIndex: 'name',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入目录名称',
            },
          ],
        }
      },
      {
        title: '路由',
        dataIndex: 'path',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入路由',
            },
          ],
        }
      },
      {
        title: '是否隐藏',
        dataIndex: 'isHide',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '是',
            status: 'Error',
          },
          0: {
            text: '否',
            status: 'Success',
          },
        },
        colProps: {
          span: 24,
        },
        initialValue: '0',
        formItemProps: {
          required: true,
          rules: [
            {
              required: true,
              message: '请选择是否隐藏',
            },
          ],
        }
      },
      {
        title: '图标',
        dataIndex: 'icon',
        colProps: {
          span: 24,
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: "textarea",
        fieldProps: {
          autoSize: { minRows: 5, maxRows: 5 },
        },
        colProps: {
          span: 24,
        },
      }
    ],
    // 编辑目录、菜单配置
    detailMenuFormItems: [
      {
        title: '类型',
        dataIndex: 'menuType',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '目录',
            status: 'Success',
          },
          2: {
            text: '菜单',
            status: 'Success',
          },
          3: {
            text: '节点',
            status: 'Success',
          },
        },
        initialValue: '1',
        colProps: {
          span: 24,
        },
        fieldProps: {
          onChange: (e) => menuTypeSelectHandle?.(e.target.value)
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择类型',
            },
          ],
        }
      },
      {
        title: '目录名称',
        dataIndex: 'name',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入目录名称',
            },
          ],
        }
      },
      {
        title: '父级目录',
        dataIndex: 'parentId',
        fieldProps: {
          treeData: []
        },
        renderFormItem() {
          return (
            <ATree
              name='parentId'
              widgetProps={{
                selectable: true,
              }}
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
        title: '路由',
        dataIndex: 'path',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入路由',
            },
          ],
        }
      },
      {
        title: '是否隐藏',
        dataIndex: 'isHide',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '是',
            status: 'Error',
          },
          0: {
            text: '否',
            status: 'Success',
          },
        },
        colProps: {
          span: 24,
        },
        initialValue: '0',
        formItemProps: {
          required: true,
          rules: [
            {
              required: true,
              message: '请选择是否隐藏',
            },
          ],
        }
      },
      {
        title: '图标',
        dataIndex: 'icon',
        colProps: {
          span: 24,
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: "textarea",
        fieldProps: {
          autoSize: { minRows: 5, maxRows: 5 },
        },
        colProps: {
          span: 24,
        },
      }
    ],
    // 编辑节点配置
    detailNodeFormItems: [
      {
        title: '类型',
        dataIndex: 'menuType',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '目录',
            status: 'Success',
            disabled: true,
          },
          2: {
            text: '菜单',
            status: 'Success',
            disabled: true,
          },
          3: {
            text: '节点',
            status: 'Success',
          },
        },
        initialValue: '3',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择类型',
            },
          ],
        }
      },
      {
        title: '节点名称',
        dataIndex: 'name',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入节点名称',
            },
          ],
        }
      },
      {
        title: '父级目录',
        dataIndex: 'parentId',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请选择父级目录',
            },
          ],
        },
        fieldProps: {
          treeData: []
        },
        renderFormItem() {
          return (
            <ATree
              name='parentId'
              widgetProps={{
                selectable: true,
              }}
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
        title: '显示标识',
        dataIndex: 'permission',
        colProps: {
          span: 24,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入显示标识',
            },
          ],
        }
      },
      {
        title: '是否隐藏',
        dataIndex: 'isHide',
        valueType: "radio",
        valueEnum: {
          1: {
            text: '是',
            status: 'Error',
          },
          0: {
            text: '否',
            status: 'Success',
          },
        },
        colProps: {
          span: 24,
        },
        initialValue: '0',
        formItemProps: {
          required: true,
          rules: [
            {
              required: true,
              message: '请选择是否隐藏',
            },
          ],
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: "textarea",
        fieldProps: {
          autoSize: { minRows: 5, maxRows: 5 },
        },
        colProps: {
          span: 24,
        },
      }
    ],
  }
}

export default pageConfig;