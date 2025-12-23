import React, { useEffect, useState } from 'react';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Image, Upload, Modal, message, Spin, Form, Button } from 'antd';
import api from '@/services/common';
import wallpaperApi from '@/services/wallpaper';
import { useHistory, useParams } from '@aniyajs/plugin-router';
import { arraysEqualAsSet, getBase64 } from '@/utils/utils';
import styles from './index.module.less';
import { iconMap } from '@/utils/constant';

const { confirm } = Modal;

export default (): React.ReactNode => {
  const [form] = Form.useForm<WallpaperTypes.WallpaperAuditDetailProps>();
  const params = useParams<{ pageType: string, id: string }>()
  const history = useHistory();
  const [previewImage, setPreviewImage] = useState<string[] | []>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  // 审核详情
  const [auditDetail, setAuditDetail] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({})
  // 初始图集详情数据
  const [initData, setInitData] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({})
  // 获取初始表单数据
  const [initialFormValues, setInitialFormValues] = useState<Partial<WallpaperTypes.WallpaperAuditDetailProps>>({});

  const columns: ProFormColumnsType<WallpaperTypes.WallpaperAuditDetailProps>[] = [
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
        disabled: params?.pageType === 'audit',
      },
    },
    {
      title: '缩略图',
      dataIndex: 'thumbnail',
      fieldProps: {
        disabled: params?.pageType === 'audit',
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
            onPreview={() => handlePreview(value?.fileList || [])}
            onRemove={() => {
              // 文件被移除时，确保表单值被正确更新
              onChange?.({
                fileList: []
              });
            }}
          >
            {
              (value?.fileList?.length || (params?.pageType === 'audit')) ? null : (
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
      request: async () => {
        const result = await api.enumSync({
          type: "WALLPAPER_TAG"
        })

        return result?.map(item => ({
          label: item?.text,
          value: item?.value,
        }))
      },
      fieldProps: {
        mode: 'multiple',
        disabled: params?.pageType === 'audit',
      },
      width: 'xl',
    },
    {
      title: '简介',
      dataIndex: 'remark',
      valueType: "textarea",
      fieldProps: {
        autoSize: { minRows: 4, maxRows: 4 },
        disabled: params?.pageType === 'audit',
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
            onPreview={() => handlePreview(value?.fileList || [])}
            onRemove={(file) => {
              // 处理文件删除
              const newFileList = value?.fileList?.filter((item: any) => item.uid !== file.uid);
              onChange?.({
                fileList: newFileList
              });
            }}
          >
            {
              ((params?.pageType === 'audit')) ? null : (
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
        disabled: params?.pageType === 'audit',
      },
    },
    {
      valueType: 'divider',
      hideInForm: !(params?.pageType !== 'audit' || (auditDetail?.status == 2))
    }
  ];

  const auditColumns: ProFormColumnsType<WallpaperTypes.WallpaperAuditDetailProps>[] = [
    {
      title: '审核状态',
      dataIndex: 'status',
      valueType: 'select',
      request: async () => {
        const result = await api.enumSync({
          type: "AUDIT_STATUS"
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

  const handlePreview = async (files: any) => {
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
    if (params?.pageType === 'audit') {
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
    if (params?.pageType === 'audit') {
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

    if (params?.pageType === 'edit') {
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
          columns={[...columns, ...((params?.pageType === 'audit' && (auditDetail?.status == 2)) ? auditColumns : [])]}
          onReset={() => {
            form.setFieldsValue({ ...initialFormValues, status: '1' });
          }}
          {...((auditDetail?.status == 1) || (auditDetail?.status == 3)) ? { submitter: false } : {}}
        />
        {previewImage && (
          <Image.PreviewGroup
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage([]),
            }}
          >
            {previewImage?.map((item: string) => (
              <Image key={item} src={item} width={200} />
            ))}
          </Image.PreviewGroup>
        )}
      </Spin>
    </div>
  );
};