import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
import { Popconfirm, Button, message, Tag, TreeProps } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import OperateRender from './OperateRender';
import SortRender from './SortRender';
import pageConfig from './pageConfig';
import { OperatorKeys, OperatorType } from './interface';
import { deassignFlatArr, flatArr, floorFlatArr, generateHierarchyPaths, multiArrayFormatter } from '@/utils/utils';
import { getMenuList } from '@/services/menuManagement/api';
import api from '@/services/menuManagement';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import dictData from '@/utils/dictData';
import { iconMap } from '@/utils/constant';

const operatorTypeDic: OperatorType = {
  add: '新建',
  update: '修改',
  delete: '删除',
  order: '排序',
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  // 初始化table数据
  const [tableData, setTableData] = useState<API.ResListData<MenuManagementTypes.MenuManagementData>>({
    data: []
  })
  const initPage = useRef<boolean>(false)
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[] | []>([]);
  const [search, setSearch] = useState<Record<string, any>>({});
  const [menuTypeSel, setMenuTypeSel] = useState<string>('')

  const [sortVisible, setSortVisible] = useState<boolean>(false)
  const [sortLoading, setSortLoading] = useState<boolean>(false)
  const [sortData, setSortData] = useState<TreeProps['treeData'] | []>([])

  const operatorHandle = async (type: OperatorKeys, data: Partial<MenuManagementTypes.MenuManagementData> & { ids?: string[] | [], list?: Record<string, any>[] | [] }, successCallback?: () => void) => {
    const newExpandedRowKeys = [...expandedRowKeys];
    setExpandedRowKeys([])
    try {
      const result = await api[`${type}Menu`](data as MenuManagementTypes.MenuManagementData);
      setSortLoading(false)
      setSortVisible(false)

      if (result?.code === 200) {
        message.success(`${operatorTypeDic[type]}成功`);
        setTableData({
          data: result?.result ?? [],
        })
        if (successCallback) {
          successCallback();
        }

        actionRef.current?.reload();

        setTimeout(() => {
          setExpandedRowKeys(newExpandedRowKeys)
        }, 100);
        return true;
      } else {
        message.error(result?.message || `${operatorTypeDic[type]}失败`);
        setTableData({
          data: [],
        })
        actionRef.current?.reload();
        setTimeout(() => {
          setExpandedRowKeys(newExpandedRowKeys)
        }, 100);
        return false;
      }
    } catch (error) {
      setSortLoading(false)
      message.error(`${operatorTypeDic[type]}失败`);
      setTableData({
        data: [],
      })
      actionRef.current?.reload();
      setTimeout(() => {
        setExpandedRowKeys(newExpandedRowKeys)
      }, 100);
      return false;
    }
  }

  const deleteHandle = async (record: Partial<MenuManagementTypes.MenuManagementData>) => {
    const ids = flatArr({ initArr: [record], childrenField: 'children' }).map(item => item?.id)

    await operatorHandle('delete', { ids })
  }

  const extraTableColumnRender = (): ProColumns<MenuManagementTypes.MenuManagementData>[] => {
    return [
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => {
          return [
            ((record?.menuType !== '3') && <OperateRender
              key="add"
              type="add"
              operatorTypeDic={operatorTypeDic}
              // @ts-ignore
              record={record}
              saveHandle={(values, successCallback) => operatorHandle('add', { ...values, id: record?.id, parentId: values?.parentId?.[0] }, successCallback)}
              menuTypeSel={menuTypeSel}
              trigger={<a key="add">新建</a>}
              onOpenChange={(callback) => onOpenChangeHandle(callback, 'add')}
            />),
            <OperateRender
              key="update"
              type="update"
              operatorTypeDic={operatorTypeDic}
              // @ts-ignore
              record={record}
              saveHandle={(values, successCallback) => operatorHandle('update', { ...values, id: record?.id, parentId: values?.parentId?.[0] }, successCallback)}
              trigger={<a key="update">修改</a>}
              onOpenChange={(callback) => onOpenChangeHandle(callback, 'update')}
            />,
            <Popconfirm
              title="删除此项"
              onConfirm={() => deleteHandle(record)}
              okText="确认"
              cancelText="取消"
            >
              <a
                key="delete"
              >
                删除
              </a>
            </Popconfirm>
          ].filter(Boolean)
        }
      },
    ]
  };

  const onOpenChangeHandle = (callback: (callbackProps: {
    detailFormItems: ProFormColumnsType<MenuManagementTypes.MenuManagementData>[][];
    type: OperatorKeys | 'addRoot';
  }) => void, type: OperatorKeys | 'addRoot') => {
    if (callback) {
      callback({
        detailFormItems: [detailMenuFormItems, detailNodeFormItems, detailRootFormItems],
        type
      })
    }
  }

  const menuTypeSelectHandle = (value: string) => {
    setMenuTypeSel(value)
  }

  const sortHandle = async (data: TreeProps['treeData'] | []) => {
    setSortLoading(true)
    const list = deassignFlatArr<MenuManagementTypes.MenuManagementData>({
      // @ts-ignore
      initArr: data,
      parentId: null,
      childrenFieldName: 'children',
      cField: 'id',
      pField: 'parentId',
      // @ts-ignore
      orderField: 'order',
    })?.map((item: Partial<MenuManagementTypes.MenuManagementData>) => ({
      id: item?.id,
      parentId: item?.parentId,
      order: item?.order,
    }));

    await operatorHandle('order', { list })
  }

  const { tableColumns = [], detailRootFormItems = [], detailMenuFormItems = [], detailNodeFormItems = [] } = pageConfig({ search, menuTypeSelectHandle })

  return (
    <>
      <ProTable<MenuManagementTypes.MenuManagementData>
        columns={[...tableColumns, ...extraTableColumnRender()]}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          setSearch(params)
          if (!initPage?.current) {
            initPage.current = true;
            const menuData = await getMenuList();

            setTableData(menuData)
            return menuData;
          } else {
            if (params?.name) {
              const regExp = new RegExp(params?.name, 'im');
              const initFlatArr = flatArr({ initArr: tableData?.data, childrenField: 'children' });
              const matchIds = initFlatArr?.filter(item => regExp.test(item.name))?.map(item => item?.id)
              const newData = initFlatArr?.filter(i => matchIds.includes(i?.id))
              const newParentIds = newData?.map(i => i?.parentId);

              // @ts-ignore
              const parentIds = [...new Set(newParentIds?.reduce((pre, cur) => [...pre, ...generateHierarchyPaths(cur), cur], []))]
              const extraParentIds = parentIds?.filter(i => !newParentIds.includes(i))
              const contaData = initFlatArr?.filter(i => extraParentIds.includes(i?.parentId))

              setExpandedRowKeys(contaData?.map(i => i?.id))
            }

            return tableData;
          }
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
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys((d) => [...d, record?.id ?? ''].filter(Boolean));
            } else {
              const ids = floorFlatArr<MenuManagementTypes.MenuManagementData>({
                initArr: tableData?.data,
                matchField: 'id',
                matchReg: record?.id ?? '',
                childrenField: 'children',
              }).map((i) => i.id);

              setExpandedRowKeys((d) => d.filter((a) => !ids.includes(a)));
            }
          }
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="order"
            icon={iconMap('SortDescendingOutlined')}
            type="primary"
            loading={sortLoading}
            onClick={async () => {
              setSortLoading(true)
              const menuData = await getMenuList();
              setSortLoading(false)
              const copyMenuData = [...(menuData?.data ?? [])];
              const formatData = multiArrayFormatter<
                MenuManagementTypes.MenuManagementData,
                TreeNodeNormal & Omit<MenuManagementTypes.MenuManagementData, 'children'>
              >({
                initArr: copyMenuData,
                initChildrenFieldName: 'children',
                resChildrenFieldName: 'children',
                // @ts-ignore
                rotorObj: (item) => {
                  const menuTypeInfo = dictData
                    ?.find((k) => k.dictName === 'menuTypeInfos')
                    ?.dictInfo?.find((i: any) => String(i.value) === String(item.menuType));
                  return {
                    key: item?.id,
                    title: (
                      <React.Fragment key={item?.id}>
                        <Tag color={menuTypeInfo?.bgc}>{menuTypeInfo?.text}</Tag>
                        {item?.name}
                      </React.Fragment>
                    ),
                    ...item,
                  };
                },
              });

              setSortData(formatData)
              setSortVisible(true)
            }}
          >
            {operatorTypeDic['order']}
          </Button>
          ,
          <OperateRender
            key="add"
            type="add"
            operatorTypeDic={operatorTypeDic}
            saveHandle={(values, successCallback) => operatorHandle('add', values, successCallback)}
            menuTypeSel={menuTypeSel}
            trigger={(
              <Button
                key="add"
                icon={iconMap('PlusOutlined')}
                type="primary"
              >
                {operatorTypeDic['add']}
              </Button>
            )}
            onOpenChange={(callback) => onOpenChangeHandle(callback, 'addRoot')}
          />
        ]}
      />
      <SortRender
        sortLoading={sortLoading}
        open={sortVisible}
        setSortVisible={setSortVisible}
        data={sortData}
        sortConfirm={(data: TreeProps['treeData'] | []) => sortHandle(data)}
      />
    </>
  );
};