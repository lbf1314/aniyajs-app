import React from 'react';
import { Tag, Tooltip } from 'antd';
import { type ProColumns } from '@ant-design/pro-components';
import api from '@/services/common';

export interface pageConfigProps {
}

export interface PageConfigTypes {
  tableColumns: ProColumns<WallpaperTypes.AuditListWallpaperItemProps>[];
}

function pageConfig({ }: pageConfigProps): PageConfigTypes {
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
        title: '审核状态',
        dataIndex: 'status',
        ellipsis: true,
        valueType: 'select',
        request: async () => {
          const result = await api.enumSync({
            type: "AUDIT_STATUS"
          })

          return result?.map(item => ({
            label: item?.text,
            value: item?.value,
          }))
        },
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
            <Tooltip placement="topLeft" title={record?.tags?.join(',')}>
              <span>{record?.tags?.join(',')}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: "dateTime",
        search: false,
        ellipsis: true,
        width: 160
      },
      {
        title: '创作者',
        dataIndex: 'createId',
        ellipsis: true,
      },
      {
        title: '审核人',
        dataIndex: 'accountId',
        ellipsis: true,
        search: false,
      },
    ],
  }
}

export default pageConfig;