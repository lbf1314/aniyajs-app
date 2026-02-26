import React, { useEffect, useState } from 'react';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Image, Upload, Modal, message, Spin, Form, Button, UploadFile, Divider, Space, Input, Tag } from 'antd';
import api from '@/services/common';
import wallpaperApi from '@/services/wallpaper';
import { useHistory, useParams } from '@aniyajs/plugin-router';
import { arraysEqualAsSet, getBase64 } from '@/utils/utils';
import styles from './index.module.less';
import { iconMap } from '@/utils/constant';
import ARadioBlock from '@/components/ARadioBlock';

const { confirm } = Modal;

export default (): React.ReactNode => {
  const [form] = Form.useForm<WallpaperTypes.WallpaperAuditDetailProps>();
  const params = useParams<{ pageType: string, id: string, operateType: string }>()
  const history = useHistory();
  const [previewImage, setPreviewImage] = useState<string[] | []>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [curPreviewIndex, setCurPreviewIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)
  // 审核详情
  const [auditDetail, setAuditDetail] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({})
  // 初始图集详情数据
  const [initData, setInitData] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({})
  // 获取初始表单数据
  const [initialFormValues, setInitialFormValues] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({});
  // 拓展标签
  const [curTag, setCurTag] = useState<string>('');
  const [tagOptions, setTagOptions] = useState<any[]>([]);

  const columns: ProFormColumnsType<WallpaperTypes.WallpaperAuditDetailProps>[] = [
    {
      title: '选择分类',
      dataIndex: 'category',
      initialValue: '2',
      fieldProps: {
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      },
      renderFormItem: () => {
        return <ARadioBlock />
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '壁纸标题',
      dataIndex: 'title',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      width: 'md',
      fieldProps: {
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      },
    },
    {
      title: '缩略图',
      dataIndex: 'thumbnail',
      fieldProps: {
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      },
      renderFormItem: (_, { onChange, value }) => {
        return (
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={value?.fileList || []} // 控制文件列表显示
            customRequest={async (options) => {
              const data = new FormData();
              data.append('files', options?.file);
              data.append('type', 'wallpaper');
              return api.uploadFileSync(data).then((res) => {
                if (res?.code === 200) {
                  options?.onSuccess?.(res?.result?.data?.[0]?.url, options?.file);
                } else {
                  options?.onError?.({
                    name: "上传失败",
                    message: res?.message
                  }, options?.file);
                }
              });
            }}
            onPreview={(file) => handlePreview(value?.fileList || [], file)}
            onRemove={() => {
              // 文件被移除时，确保表单值被正确更新
              onChange?.({
                fileList: []
              });
            }}
          >
            {
              (value?.fileList?.length || (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show')) ? null : (
                <div>
                  {iconMap('PlusOutlined')}
                  <div style={{ marginTop: 8 }}>上传缩略图</div>
                </div>
              )
            }
          </Upload>
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
            validator: (_, value) => {
              // 自定义验证规则，检查 fileList 是否为空
              if (!value || !value.fileList || value.fileList.length === 0) {
                return Promise.reject('请上传缩略图');
              }
              // 检查是否有正在上传的文件
              const hasUploading = value.fileList.some((file: any) => file.status === 'uploading');
              if (hasUploading) {
                return Promise.reject('请等待图片上传完成');
              }
              return Promise.resolve();
            },
          },
        ],
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      valueType: "select",
      fieldProps: {
        mode: 'multiple',
        options: tagOptions,
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
        popupRender: (menu: React.ReactNode) => {
          return (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  value={curTag}
                  placeholder="请输入标签"
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={iconMap('PlusOutlined')} onClick={addItem}>
                  拓展标签
                </Button>
              </Space>
            </>
          )
        }
      },
      width: 'xl',
    },
    {
      title: '简介',
      dataIndex: 'remark',
      valueType: "textarea",
      fieldProps: {
        autoSize: { minRows: 4, maxRows: 4 },
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      },
      width: 'xl',
    },
    {
      title: '图片上传',
      dataIndex: 'imgUrls',
      renderFormItem: (_, { onChange, value }) => {
        return (
          <Upload
            listType="picture-card"
            multiple
            fileList={value?.fileList || []} // 控制文件列表显示
            customRequest={async (options) => {
              const data = new FormData();
              data.append('files', options?.file);
              data.append('type', 'wallpaper');
              return api.uploadFileSync(data).then((res) => {
                if (res?.code === 200) {
                  options.onSuccess?.(res?.result?.data?.[0]?.url, options?.file);
                } else {
                  options?.onError?.({
                    name: "上传失败",
                    message: res?.message
                  }, options?.file);
                }
              });
            }}
            onPreview={(file) => handlePreview(value?.fileList || [], file)}
            onRemove={(file) => {
              // 处理文件删除
              const newFileList = value?.fileList?.filter((item: any) => item.uid !== file.uid);
              onChange?.({
                fileList: newFileList
              });
            }}
          >
            {
              ((params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show')) ? null : (
                <div>
                  {iconMap('PlusOutlined')}
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )
            }
          </Upload>
        );
      },
      fieldProps: {
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      },
    },
    {
      valueType: 'divider',
    },
    {
      title: '是否公开',
      dataIndex: 'isPublic',
      valueType: "switch",
      initialValue: true,
      fieldProps: {
        checkedChildren: '是',
        uncheckedChildren: '否',
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      }
    },
    {
      title: '允许评论',
      dataIndex: 'isComment',
      valueType: "switch",
      initialValue: true,
      fieldProps: {
        checkedChildren: '是',
        uncheckedChildren: '否',
        disabled: (params?.pageType === 'wallpaperAudit') || (params?.operateType === 'show'),
      }
    },
    {
      valueType: 'divider',
      hideInForm: !(params?.pageType !== 'wallpaperAudit' || (auditDetail?.status == 2)) || (params?.operateType === 'show')
    }
  ];

  const auditColumns: ProFormColumnsType<WallpaperTypes.WallpaperAuditDetailProps>[] = [
    {
      title: '审核状态',
      dataIndex: 'status',
      valueType: 'select',
      request: async () => {
        const result = await api.enumSync({
          types: ["AUDIT_STATUS"]
        })

        return result?.map(item => ({
          label: item?.text,
          value: item?.value,
        }))?.filter((item: any) => item?.value != 2)
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      width: 'xs',
    },
    {
      title: '审核建议',
      dataIndex: 'aduitText',
      valueType: "textarea",
      fieldProps: {
        autoSize: { minRows: 4, maxRows: 4 },
      },
      width: 'xl',
    },
    {
      valueType: 'divider',
    }
  ]

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (!curTag.trim()) {
      message.warning('请输入标签名称');
      return;
    }

    // 检查标签是否已存在
    const tagExists = tagOptions.some(option => option.value === curTag.trim());
    if (tagExists) {
      message.warning('该标签已存在');
      setCurTag('');
      return;
    }

    // 添加新标签到选项列表
    const newOption = {
      label: curTag.trim(),
      value: curTag.trim(),
    };
    setTagOptions([...tagOptions, newOption]);

    // 如果需要同时选中这个新标签
    const currentTags = form.getFieldValue('tags') || [];
    form.setFieldsValue({ tags: [...currentTags, curTag.trim()] });

    // 清空当前输入
    setCurTag('');
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurTag(event.target.value);
  };

  const handlePreview = async (files: any, file: UploadFile) => {
    setCurPreviewIndex(files?.findIndex((item: any) => item.uid === file.uid))
    const newFilesAsync = files?.map(async (file: any) => {
      if (file.async) {
        return file.url;
      }
      return await getBase64(file.originFileObj)
    })

    const newFiles = await Promise.all(newFilesAsync)

    setPreviewImage(newFiles);
    setPreviewOpen(true);
  };

  const onFinish = async (values: WallpaperTypes.WallpaperAuditDetailProps) => {
    // @ts-ignore
    const isUploading = values?.imgUrls?.fileList?.some((item: any) => item.status === 'uploading');
    if (isUploading) {
      confirm({
        title: '图片上传中，是否直接提交？?',
        icon: iconMap('ExclamationCircleFilled'),
        content: '直接提交可能导致未上传完成的图片将被丢弃',
        onOk() {
          onSubmit(values)
        },
      });

      return false;
    }

    onSubmit(values)
  }

  const onSubmit = (values: WallpaperTypes.WallpaperAuditDetailProps) => {
    if (params?.pageType === 'wallpaperAudit') {
      auditSaveSyncHandle(values)
      return false;
    }

    addUpdateSyncHandle(values)
  }

  // 新建&修改壁纸
  const addUpdateSyncHandle = (values: WallpaperTypes.WallpaperAuditDetailProps) => {
    let updateKeys = [];
    let deleteImgIds = [];
    let imgUrls = values?.imgUrls?.fileList?.map((item: any) => (item.response)).filter(Boolean);
    if (Object.keys(initData).length) {
      if (values?.title !== initData?.title) {
        updateKeys.push('title')
      }
      if (values?.thumbnail?.fileList?.[0]?.response !== initData?.thumbnail?.fileList?.[0]?.response) {
        updateKeys.push('thumbnail')
      }
      if (values?.remark != initData?.remark) {
        updateKeys.push('remark')
      }
      if (!arraysEqualAsSet(values?.tags, initData?.tags ?? [])) {
        updateKeys.push('tags')
      }

      deleteImgIds = initData?.imgUrls?.fileList?.filter((item: any) => !values?.imgUrls?.fileList?.some((file: any) => file.uid === item?.uid))?.map((item: any) => item.uid).filter(Boolean)

      imgUrls = values?.imgUrls?.fileList?.filter((item: any) => !item.async)?.map((item: any) => (item.response)).filter(Boolean)

      if (!(updateKeys?.length || deleteImgIds?.length || imgUrls?.length)) {
        message.info('当前未做任何修改');
        return false;
      }
    }

    const payload = {
      ...values,
      imgUrls,
      thumbnail: values?.thumbnail?.fileList?.[0]?.response,
      id: params?.id ?? null,
      updateKeys,
      deleteImgIds,
    }

    setLoading(true)

    wallpaperApi.addUpdateSync(payload).then((res) => {
      setLoading(false)
      if (res?.code === 200) {
        message.success('提交成功');
        history.push('/business/happyHodgepodge/wallpaper/wallpaperAudit');
      } else {
        message.error('提交失败');
      }
    });
  }
  // 提交审核
  const auditSaveSyncHandle = (values: WallpaperTypes.WallpaperAuditDetailProps) => {
    const payload = {
      ...auditDetail,
      aduitText: values?.aduitText,
      status: values?.status,
    }

    setLoading(true)

    wallpaperApi.auditSaveSync(payload).then((res) => {
      setLoading(false)
      if (res?.code === 200) {
        message.success('提交成功');
        history.push('/business/happyHodgepodge/wallpaper/wallpaperList');
      } else {
        message.error('提交失败');
      }
    });
  }

  // 返回
  const goBack = () => {
    history.goBack();
  }

  useEffect(() => {
    // 获取现有的标签选项
    api.enumSync({ types: ["WALLPAPER_TAG"] }).then((result) => {
      if (result) {
        const options = result.map(item => ({
          label: item?.text,
          value: item?.value,
        }));
        setTagOptions(options);
      }
    });

    if (params?.pageType === 'wallpaperAudit') {
      wallpaperApi.auditDetailSync({ id: params?.id }).then((res) => {
        if (res?.code === 200) {
          const detailInfo = {
            ...res?.result,
            thumbnail: {
              fileList: [{
                uid: '-1',
                name: '缩略图',
                status: 'done',
                url: res?.result?.thumbnail,
                response: res?.result?.thumbnail,
                async: true
              }]
            },
            imgUrls: {
              fileList: res?.result?.imgUrls?.map((item: string, index: number) => ({
                uid: `${index}`,
                name: item,
                status: 'done',
                url: item,
                response: item,
                async: true
              }))
            }
          }
          setAuditDetail(res?.result ?? {});
          form.setFieldsValue({ ...detailInfo, status: '1' });
          setInitialFormValues(detailInfo);
        }
      });
    }

    if (params?.pageType === 'wallpaperList') {
      wallpaperApi.detailInfoSync({ id: params?.id }).then((res) => {
        if (res?.code === 200) {
          const detailInfo = {
            ...res?.result,
            thumbnail: {
              fileList: [{
                uid: '-1',
                name: '缩略图',
                status: 'done',
                url: res?.result?.thumbnail,
                response: res?.result?.thumbnail,
                async: true
              }]
            },
            imgUrls: {
              fileList: res?.result?.imgUrls?.map((item: { imgUrl: string; hot: number, id: string }, index: number) => ({
                uid: item?.id,
                name: item?.imgUrl,
                status: 'done',
                url: item?.imgUrl,
                response: item?.imgUrl,
                async: true
              }))
            }
          }
          setInitData(detailInfo)
          form.setFieldsValue(detailInfo);
          setInitialFormValues(detailInfo);
        }
      });
    }
  }, [])

  return (
    <div className={styles.createWallpaperForm}>
      {params?.pageType ? <Button className={styles.backBtn} onClick={goBack}>返回上一页</Button> : null}
      <Spin spinning={loading}>
        <BetaSchemaForm<WallpaperTypes.WallpaperAuditDetailProps>
          form={form}
          shouldUpdate={false}
          layoutType="Form"
          onFinish={onFinish}
          columns={[...columns, ...((params?.pageType === 'wallpaperAudit' && (auditDetail?.status == 2) && (params?.operateType != 'show')) ? auditColumns : [])]}
          onReset={() => {
            form.setFieldsValue({ ...initialFormValues, status: '1' });
          }}
          {...((auditDetail?.status == 1) || (auditDetail?.status == 3) || (params?.operateType === 'show')) ? { submitter: false } : {}}
        />
        {previewImage && (
          <Image.PreviewGroup
            preview={{
              current: curPreviewIndex,
              visible: previewOpen,
              onChange: (index) => setCurPreviewIndex(index),
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage([]),
            }}
          >
            {previewImage?.map((item: string) => (
              <Image style={{ display: 'none' }} key={item} src={item} width={200} />
            ))}
          </Image.PreviewGroup>
        )}
      </Spin>
    </div>
  );
};