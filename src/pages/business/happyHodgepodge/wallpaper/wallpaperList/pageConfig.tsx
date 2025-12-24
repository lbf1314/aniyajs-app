import React from 'react';
import { type ProColumns } from '@ant-design/pro-components';
import api from '@/services/common';
import { Tooltip } from 'antd';
import { iconMap } from '@/utils/constant';

export interface pageConfigProps {
  goAudit: (data: WallpaperTypes.WallpaperItemProps) => void;
}

export interface PageConfigTypes {
  tableColumns: ProColumns<WallpaperTypes.WallpaperItemProps>[];
}

function pageConfig({ goAudit }: pageConfigProps): PageConfigTypes {
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
        title: '图集标题',
        dataIndex: 'title',
        ellipsis: true,
      },
      {
        title: '缩略图',
        dataIndex: 'thumbnail',
        valueType: "image",
        fieldProps: {
          disabled: true,
        },
        ellipsis: true,
        search: false,
      },
      {
        title: '图集标签',
        dataIndex: 'tags',
        ellipsis: true,
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
        },
        request: async () => {
          const result = await api.enumSync({
            type: "WALLPAPER_TAG"
          })

          return result?.map(item => ({
            label: item?.text,
            value: item?.value,
          }))
        },
        render: (_, record) => {
          if (!record?.tags?.length) {
            return '-';
          }

          return (
            <Tooltip title={record?.tags?.join(',')}>
              <span>{record?.tags?.join(',')}</span>
            </Tooltip>
          )
        },
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
        title: '创作者',
        dataIndex: 'accountId',
        ellipsis: true,
      },
      {
        title: '当前审核',
        dataIndex: 'auditId',
        ellipsis: true,
        search: false,
        render: (_, record) => {
          if (!record?.auditId) {
            return '-';
          }

          return iconMap('AuditOutlined', {
            style: {
              color: "#1890ff",
              fontSize: 16,
            },
            onClick: () => goAudit(record)
          })
        },
      },
    ],
  }
}

export default pageConfig;