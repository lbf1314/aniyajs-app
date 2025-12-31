import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import pageConfig from './pageConfig';
import api from '@/services/wallpaper';
import { useHistory } from '@aniyajs/plugin-router';
import AuthBlock from '@/components/AuthBlock';
import { Tooltip } from 'antd';
import { iconMap } from '@/utils/constant';
import { OperatorKeys } from './interface';

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
            <AuthBlock key="show" authority="wallpaperAudit:show">
              <Tooltip title="查看">
                <a key="show" onClick={() => goAudit(record, 'show')}>
                  {iconMap('EyeOutlined', { style: { fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' } })}
                </a>
              </Tooltip>
            </AuthBlock>,
            (record?.status != 2) ? null : <AuthBlock key="audit" authority="wallpaperAudit:audit">
              <Tooltip title="审核">
                <a key="audit" onClick={() => goAudit(record, 'audit')}>
                  {iconMap('AuditOutlined', { style: { fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' } })}
                </a>
              </Tooltip>
            </AuthBlock>,
          ]
        }
      },
    ]
  };

  const goAudit = (data: WallpaperTypes.AuditListWallpaperItemProps, operateType: OperatorKeys) => {
    history.push('/business/happyHodgepodge/wallpaper/wallpaperAudit/detailInfo', {
      data: {
        id: data?.id ?? '',
        pageType: "wallpaperAudit",
        operateType
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