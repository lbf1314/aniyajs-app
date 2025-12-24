import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import pageConfig from './pageConfig';
import api from '@/services/wallpaper';
import { useHistory } from '@aniyajs/plugin-router';
import AuthBlock from '@/components/AuthBlock';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const history = useHistory();

  const extraTableColumnRender = (): ProColumns<WallpaperTypes.WallpaperItemProps>[] => {
    return [
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => {
          return [
            <AuthBlock key={'update'} authority="wallpaperList:update">
              <a key="update" onClick={() => goEdit(record)}>修改</a>
            </AuthBlock>,
            <AuthBlock key={'delete'} authority="wallpaperList:delete">
              <Popconfirm
                key="delete"
                title="确认删除？"
                onConfirm={() => deleteHandle(record)}
                okText="确认"
                cancelText="取消"
              >
                <a key="delete">删除</a>
              </Popconfirm>
            </AuthBlock>,
          ]
        }
      },
    ]
  };

  const deleteHandle = async (data: WallpaperTypes.WallpaperItemProps) => {
    try {
      const result = await api.deleteSync(data);
      if (result?.code === 200) {
        message.success('删除成功');
        actionRef.current?.reload();
        return true;
      } else {
        message.error('删除失败');
        actionRef.current?.reload();
        return false;
      }
    } catch (error) {
      message.error('删除失败');
      actionRef.current?.reload();
      return false;
    }
  }

  const goEdit = (data: WallpaperTypes.WallpaperItemProps) => {
    if (data?.auditId) {
      message.info('待审核的壁纸集不能修改');
      return false
    }
    history.push('/business/happyHodgepodge/wallpaper/wallpaperList/detailInfo', {
      data: {
        id: data?.id ?? '',
        pageType: 'edit',
      }
    })
  }

  const goAudit = (data: WallpaperTypes.WallpaperItemProps) => {
    history.push('/business/happyHodgepodge/wallpaper/wallpaperAudit/detailInfo', {
      data: {
        id: data?.auditId ?? '',
        pageType: 'audit',
      }
    })
  }

  const { tableColumns = [] } = pageConfig({ goAudit })

  return (
    <ProTable<WallpaperTypes.WallpaperItemProps>
      columns={[...tableColumns, ...extraTableColumnRender()]}
      actionRef={actionRef}
      cardBordered
      request={async (params) => {
        return api.listSync(params)
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
    />
  );
};