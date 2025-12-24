import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import pageConfig from './pageConfig';
import api from '@/services/wallpaper';
import { useHistory } from '@aniyajs/plugin-router';
import AuthBlock from '@/components/AuthBlock';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const history = useHistory();

  const extraTableColumnRender = (): ProColumns<WallpaperTypes.AuditListWallpaperItemProps>[] => {
    return [
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => {
          return [
            <AuthBlock key={'audit'} authority="wallpaperAudit:audit">
              <a key="audit" onClick={() => goAudit(record)}>审核</a>
            </AuthBlock>,
          ]
        }
      },
    ]
  };

  const goAudit = (data: WallpaperTypes.AuditListWallpaperItemProps) => {
    history.push('/business/happyHodgepodge/wallpaper/wallpaperAudit/detailInfo', {
      data: {
        id: data?.id ?? '',
        pageType: 'audit',
      }
    })
  }

  const { tableColumns = [] } = pageConfig({})

  return (
    <ProTable<WallpaperTypes.AuditListWallpaperItemProps>
      columns={[...tableColumns, ...extraTableColumnRender()]}
      actionRef={actionRef}
      cardBordered
      request={async (params) => {
        return api.auditListSync(params)
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