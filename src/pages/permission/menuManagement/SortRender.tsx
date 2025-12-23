import React, { useEffect, useState } from 'react';
import { Button, Drawer, Tree, TreeProps } from 'antd';
import type { DataNode } from 'antd/es/tree';

export interface OperateRenderProps {
  open: boolean;
  sortLoading: boolean;
  setSortVisible: (visible: boolean) => void;
  data: TreeProps['treeData'] | []
  sortConfirm: (data: TreeProps['treeData'] | []) => void
}

const OperateRender: React.FC<OperateRenderProps> = (props) => {
  const { open, setSortVisible, data, sortConfirm, sortLoading } = props
  const [sortTreeData, setSortTreeData] = useState<TreeProps['treeData'] | []>(data);
  let dragObj: DataNode;

  const loop = (
    data: DataNode[],
    key: React.Key,
    callback: (node: DataNode, i: number, data: DataNode[]) => void,
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback);
      }
    }
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = [...(sortTreeData as DataNode[] | [])];

    if (
      ((info.node as any).menuType === 3 &&
        (info.dragNode as any).parentId !== (info.node as any).parentId) ||
      (!info.dropToGap &&
        (info.node as any).menuType === 2 &&
        (info.dragNode as any).parentId !== (info.node as any).key) ||
      (!info.dropToGap &&
        (info.dragNode as any).menuType === 3 &&
        (info.dragNode as any).parentId !== (info.node as any).key) ||
      (info.dropToGap &&
        (info.dragNode as any).menuType === 3 &&
        (info.dragNode as any).parentId !== (info.node as any).parentId)
    ) {
      return;
    }

    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 &&
      (info.node as any).props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    setSortTreeData(data);
  };

  useEffect(() => {
    setSortTreeData(data)
  }, [data])

  return (
    <Drawer
      title="拖拽排序"
      destroyOnHidden
      width={600}
      open={open}
      maskClosable={true}
      onClose={() => setSortVisible(false)}
      styles={{
        footer: {
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
          gap: 8
        }
      }}
      footer={[
        <Button
          key={'cancel'}
          onClick={() => {
            setSortVisible(false)
          }}
        >
          取消
        </Button>,
        <Button
          loading={sortLoading}
          type='primary'
          key={'confirm'}
          onClick={() => sortConfirm(sortTreeData)}
        >
          确定
        </Button>
      ]}
    >
      <Tree
        treeData={sortTreeData}
        draggable={true}
        blockNode={true}
        onDrop={onDrop}
      />
    </Drawer>
  )
}

export default OperateRender;