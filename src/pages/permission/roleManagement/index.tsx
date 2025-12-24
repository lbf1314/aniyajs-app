import React, { useEffect, useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Popconfirm, Button, Tag } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import OperateRender from './operateRender';
import pageConfig from './pageConfig';
import api from '@/services/roleManagement';
import { OperatorKeys, OperatorType } from './interface';
import { getMenuList } from '@/services/menuManagement/api';
import { multiArrayFormatter } from '@/utils/utils';
import dictData from '@/utils/dictData';
import type { DataNode } from 'antd/lib/tree/index';
import { iconMap } from '@/utils/constant';

const operatorTypeDic: OperatorType = {
  add: '新建',
  update: '修改',
  delete: '删除',
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = React.useState<DataNode[]>([]);

  const operatorHandle = async (type: OperatorKeys, data: RoleManagementTypes.RoleManagementItem, successCallback?: () => void) => {
    try {
      const result = await api[`${type}Role`](data);
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

  const extraTableColumnRender = (): ProColumns<RoleManagementTypes.RoleManagementItem>[] => {
    return [
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => {
          return [
            <OperateRender
              key="update"
              type="update"
              operatorTypeDic={operatorTypeDic}
              record={record}
              saveHandle={(values, successCallback) => operatorHandle('update', { ...values, id: record?.id }, successCallback)}
              detailFormItems={detailFormItems}
              trigger={<a key="update">修改</a>}
              onOpenChange={onOpenChange}
            />,
            <Popconfirm
              title="删除此项"
              onConfirm={() => { }}
              okText="确认"
              cancelText="取消"
            >
              <a
                key="delete"
              >
                删除
              </a>
            </Popconfirm>
          ]
        }
      },
    ]
  };

  // 获取菜单数据
  const getMenusList = async () => {
    const menuData = await getMenuList();

    const treeData = multiArrayFormatter<MenuManagementTypes.MenuManagementData, DataNode>({
      initArr: menuData?.data ?? [],
      initChildrenFieldName: 'children',
      resChildrenFieldName: 'children',
      rotorObj: (item) => {
        const menuTypeInfo = dictData
          ?.find((k) => k?.dictName === 'menuTypeInfos')
          ?.dictInfo?.filter((i: any) => String(i.value) === String(item.menuType))?.[0];

        return {
          key: item?.id,
          title: (
            <React.Fragment key={item?.id}>
              <Tag color={menuTypeInfo?.bgc}>{menuTypeInfo?.text}</Tag>
              {item?.name}
            </React.Fragment>
          ),
        };
      },
    })

    setTreeData(treeData);
  }

  useEffect(() => {
    getMenusList();
  }, []);

  const onOpenChange = (visible: boolean) => {
    if (visible) {
      getMenusList();
    }
  }

  const { tableColumns = [], detailFormItems = [] } = pageConfig({ treeData })

  return (
    <ProTable<RoleManagementTypes.RoleManagementItem>
      columns={[...tableColumns, ...extraTableColumnRender()]}
      actionRef={actionRef}
      cardBordered
      request={async (params) => {
        return api.getList(params)
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
      toolBarRender={() => [
        <OperateRender
          key="add"
          type="add"
          onOpenChange={onOpenChange}
          operatorTypeDic={operatorTypeDic}
          saveHandle={(values, successCallback) => operatorHandle('add', values, successCallback)}
          detailFormItems={detailFormItems}
          trigger={(
            <Button
              key="button"
              icon={iconMap('PlusOutlined')}
              type="primary"
            >
              {operatorTypeDic['add']}
            </Button>
          )}
        />
      ]}
    />
  );
};