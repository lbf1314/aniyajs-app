import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Form, FormInstance, Tag } from 'antd';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';
import { OperatorKeys, OperatorType } from './interface';
import type { DataNode } from 'antd/lib/tree/index';
import { getMenuList } from '@/services/menuManagement/api';
import { multiArrayFormatter } from '@/utils/utils';
import dictData from '@/utils/dictData';

export interface OperateRenderRef {
  form: FormInstance<MenuManagementTypes.MenuManagementData>;
}

export interface OperateRenderProps {
  menuTypeSel?: string;
  type: OperatorKeys;
  operatorTypeDic: OperatorType;
  trigger: JSX.Element;
  onOpenChange?: (callback: (callbackProps: {
    detailFormItems: ProFormColumnsType<MenuManagementTypes.MenuManagementData>[][];
    type: OperatorKeys | 'addRoot';
  }) => void) => void;
  saveHandle?: (values: MenuManagementTypes.MenuManagementData, callback: () => void) => void;
  record?: Partial<MenuManagementTypes.MenuManagementData>;
}

const OperateRender = forwardRef<OperateRenderRef, OperateRenderProps>((props, ref) => {
  const [form] = Form.useForm<MenuManagementTypes.MenuManagementData>();
  const { saveHandle, menuTypeSel, onOpenChange, operatorTypeDic, type, trigger, record = {} } = props;
  const [newDetailFormItems, setNewDetailFormItems] = useState<ProFormColumnsType<MenuManagementTypes.MenuManagementData>[]>([])

  useImperativeHandle(ref, () => ({
    form
  }));

  const onFinish = async (values: MenuManagementTypes.MenuManagementData) => {
    if (saveHandle) {
      saveHandle?.(values, () => {
        form?.resetFields();
      })

      return true;
    }
  };

  useEffect(() => {
    const findNameIndex = newDetailFormItems.findIndex(item => item.dataIndex === 'name');
    if (findNameIndex > -1) {
      const updatedFormItems = newDetailFormItems.map((item, index) => {
        if (index === findNameIndex) {
          if (menuTypeSel == '1') {
            return {
              ...item,
              title: "目录名称",
              formItemProps: {
                ...item.formItemProps,
                rules: [{ required: true, message: '请输入目录名称' }]
              }
            };
          }

          if (menuTypeSel == '2') {
            return {
              ...item,
              title: "菜单名称",
              formItemProps: {
                ...item.formItemProps,
                rules: [{ required: true, message: '请输入菜单名称' }]
              }
            };
          }
        }

        return item;
      });

      setNewDetailFormItems(updatedFormItems);
    }
  }, [menuTypeSel]);

  return (
    <BetaSchemaForm<MenuManagementTypes.MenuManagementData>
      title={`${operatorTypeDic[type]}`}
      width={600}
      form={form}
      trigger={trigger}
      grid={true}
      layoutType="DrawerForm"
      onOpenChange={(visible) => {
        if (onOpenChange) {
          onOpenChange(async (
            { detailFormItems: detailFormItemData, type }
          ) => {
            const menuData = await getMenuList();

            const treeData = multiArrayFormatter<MenuManagementTypes.MenuManagementData, DataNode>({
              initArr: menuData?.data ?? [],
              initChildrenFieldName: 'children',
              resChildrenFieldName: 'children',
              // @ts-ignore
              rotorObj: (item) => {
                const disabled =
                  ((item?.menuType === '1' || item?.menuType === '3') && type === 'add' && record?.menuType === '2') ||
                  ((item?.menuType === '2' || item?.menuType === '3') && type === 'add' && record?.menuType === '1') ||
                  ((item?.menuType === '2' || item?.menuType === '3') && type === 'update' && record?.menuType === '2') ||
                  ((item?.menuType === '2' || item?.menuType === '3') && type === 'update' && record?.menuType === '1') ||
                  ((item?.menuType === '1' || item?.menuType === '3') && type === 'update' && record?.menuType === '3') ||
                  false
                const menuTypeInfo = dictData
                  ?.find((k) => k?.dictName === 'menuTypeInfos')
                  ?.dictInfo?.filter((i: any) => String(i.value) === String(item.menuType))?.[0];

                return {
                  key: item?.id,
                  selectable: !disabled,
                  ...disabled ? {
                    style: {
                      color: `rgba(0,0,0,0.25)`,
                    },
                  } : {},
                  menuType: item?.menuType,
                  title: (
                    <React.Fragment key={item?.id}>
                      <Tag color={menuTypeInfo?.bgc}>{menuTypeInfo?.text}</Tag>
                      {item?.name}
                    </React.Fragment>
                  ),
                };
              },
            })

            if (type === 'add') {
              let newDetailFormItemData =
                (record?.menuType === '1' && detailFormItemData?.[0]) ||
                (record?.menuType === '2' && detailFormItemData?.[1]) ||
                [];

              const findParentIdIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'parentId');
              const findNameIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'name');
              const findMenuTypeIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'menuType');

              if (record?.menuType === '1') {
                // 使用 map 创建新的数组和对象引用
                newDetailFormItemData = newDetailFormItemData.map((item, index) => {
                  if (index === findNameIndex) {
                    return {
                      ...item,
                      title: "目录名称",
                      // @ts-ignore
                      formItemProps: {
                        ...item.formItemProps,
                        rules: [{ required: true, message: '请输入目录名称' }]
                      }
                    };
                  }

                  if (index === findMenuTypeIndex) {
                    return {
                      ...item,
                      valueEnum: {
                        ...item.valueEnum,
                        // @ts-ignore
                        '1': { ...item.valueEnum['1'], disabled: false },
                        // @ts-ignore
                        '2': { ...item.valueEnum['2'], disabled: false },
                        // @ts-ignore
                        '3': { ...item.valueEnum['3'], disabled: true }
                      }
                    };
                  }

                  return item;
                });
              }

              if (findParentIdIndex > -1) {
                // 创建新的数组确保对象引用发生变化
                newDetailFormItemData = newDetailFormItemData.map((item, index) => {
                  if (index === findParentIdIndex) {
                    return {
                      ...item,
                      // @ts-ignore
                      fieldProps: {
                        ...item.fieldProps,
                        treeData: treeData
                      },
                      initialValue: [record?.id]
                    };
                  }
                  return item;
                });
              }

              setNewDetailFormItems(newDetailFormItemData);
            }

            if (type === 'update') {
              let newDetailFormItemData =
                ((record?.menuType === '1' || record?.menuType === '2') && detailFormItemData?.[0]) ||
                (record?.menuType === '3' && detailFormItemData?.[1]) ||
                [];

              const findNameIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'name');
              const findMenuTypeIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'menuType');

              if (record?.menuType === '1') {
                newDetailFormItemData = newDetailFormItemData.map((item, index) => {
                  if (index === findNameIndex) {
                    return {
                      ...item,
                      title: "目录名称",
                      // @ts-ignore
                      formItemProps: {
                        ...item.formItemProps,
                        rules: [{ required: true, message: '请输入目录名称' }]
                      }
                    };
                  }

                  if (index === findMenuTypeIndex) {
                    return {
                      ...item,
                      valueEnum: {
                        ...item.valueEnum,
                        // @ts-ignore
                        '1': { ...item.valueEnum['1'], disabled: false },
                        // @ts-ignore
                        '2': { ...item.valueEnum['2'], disabled: true },
                        // @ts-ignore
                        '3': { ...item.valueEnum['3'], disabled: true }
                      }
                    };
                  }

                  return item;
                });
              }

              if (record?.menuType === '2') {
                newDetailFormItemData = newDetailFormItemData.map((item, index) => {
                  if (index === findNameIndex) {
                    return {
                      ...item,
                      title: "菜单名称",
                      // @ts-ignore
                      formItemProps: {
                        ...item.formItemProps,
                        rules: [{ required: true, message: '请输入菜单名称' }]
                      }
                    };
                  }

                  if (index === findMenuTypeIndex) {
                    return {
                      ...item,
                      valueEnum: {
                        ...item.valueEnum,
                        // @ts-ignore
                        '1': { ...item.valueEnum['1'], disabled: true },
                        // @ts-ignore
                        '2': { ...item.valueEnum['2'], disabled: false },
                        // @ts-ignore
                        '3': { ...item.valueEnum['3'], disabled: true }
                      }
                    };
                  }

                  return item;
                });
              }

              const findParentIdIndex = newDetailFormItemData.findIndex(item => item.dataIndex === 'parentId');

              if (findParentIdIndex > -1) {
                newDetailFormItemData = newDetailFormItemData.map((item, index) => {
                  if (index === findParentIdIndex) {
                    return {
                      ...item,
                      // @ts-ignore
                      fieldProps: {
                        ...item.fieldProps,
                        treeData: treeData
                      }
                    };
                  }
                  return item;
                });
              }

              setNewDetailFormItems(newDetailFormItemData);
            }

            if (type === 'addRoot') {
              setNewDetailFormItems(detailFormItemData?.[2] || []);
            }
          })
        }
        if (visible) {
          if (type === 'update') {
            form?.setFieldsValue({
              ...record,
              // @ts-ignore
              parentId: record?.parentId ? [record?.parentId] : []
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
      columns={newDetailFormItems}
    />
  )
})

export default OperateRender;