export default [
  {
    dictName: 'menuTypeInfos',
    dictInfo: [
      {
        value: "1",
        bgc: '#ff5500',
        text: '目录',
      },
      {
        value: "2",
        bgc: '#faad14',
        text: '菜单',
      },
      {
        value: "3",
        bgc: '#13c2c2',
        text: '节点',
      },
    ],
  },
] as { dictName: string; dictInfo: Partial<Record<string, any>> }[];
