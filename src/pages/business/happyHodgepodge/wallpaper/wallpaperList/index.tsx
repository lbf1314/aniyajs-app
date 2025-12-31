import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Popconfirm, Tooltip } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import pageConfig from './pageConfig';
import api from '@/services/wallpaper';
import { useHistory } from '@aniyajs/plugin-router';
import AuthBlock from '@/components/AuthBlock';
import { iconMap } from '@/utils/constant';
import { OperatorKeys } from './interface';

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
            <AuthBlock key="show" authority="wallpaperList:show">
              <Tooltip title="查看">
                <a key="show" onClick={() => goEdit(record, 'show')}>
                  {iconMap('EyeOutlined', { style: { fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' } })}
                </a>
              </Tooltip>
            </AuthBlock>,
            <AuthBlock key="update" authority="wallpaperList:update">
              <Tooltip title="编辑">
                <a key="update" onClick={() => goEdit(record, 'update')}>
                  {iconMap('EditOutlined', { style: { fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' } })}
                </a>
              </Tooltip>
            </AuthBlock>,
            <AuthBlock key="delete" authority="wallpaperList:delete">
              <Popconfirm
                key="delete"
                title="确认删除？"
                onConfirm={() => deleteHandle(record)}
                okText="确认"
                cancelText="取消"
              >
                <Tooltip title="删除">
                  <a key="delete">
                    {iconMap('DeleteOutlined', { style: { fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' } })}
                  </a>
                </Tooltip>
              </Popconfirm>
            </AuthBlock>
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

  const goEdit = (data: WallpaperTypes.WallpaperItemProps, operateType?: OperatorKeys) => {
    if (data?.auditId && (operateType == 'update')) {
      message.info('待审核的壁纸集不能修改');
      return false
    }
    history.push('/business/happyHodgepodge/wallpaper/wallpaperList/detailInfo', {
      data: {
        id: data?.id ?? '',
        pageType: 'wallpaperList',
        operateType
      }
    })
  }

  const goAudit = (data: WallpaperTypes.WallpaperItemProps, operateType?: string) => {
    history.push('/business/happyHodgepodge/wallpaper/wallpaperAudit/detailInfo', {
      data: {
        id: data?.auditId ?? '',
        pageType: 'wallpaperAudit',
        operateType
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