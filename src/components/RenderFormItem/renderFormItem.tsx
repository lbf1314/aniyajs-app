/**
 * 这个组件帮助你实现以下功能：
 * formItem简单封装，可使用配置式完成你的模块
 *
 */

import React from 'react';
import * as AntdJsComponents from '@aniyajs/components';
import { tuple } from '@/utils/type';
import type { RenderFormItemType } from './type';

// import type { IBaseWidgetProps } from '@aniyajs/components/es/form/types';

const WidgetTypes = tuple(
  'AInput',
  'AInputPassword',
  'AInputTextArea',
  'AInputNumber',
  'ACascader',
  'ACheckboxGroup',
  'ADatePicker',
  'ADateRangePicker',
  'ARadioGroup',
  'ASelect',
  'ASwitch',
  'ATree',
  'AUpload',
);

// export type WidgetType = typeof WidgetTypes[number]
// export type WidgetType = keyof AllWidgetProps;
// export type RenderFormItemPropsType = I·BaseWidgetProps<any> &
//   Record<string, any> & {
//     label?: IBaseWidgetProps<any>['label'];
//     widget: WidgetType;
//     required?: boolean;
//     widgetProps?: AllWidgetProps[WidgetType]['widgetProps'];
//   };

export type RenderFormItemPropsType = RenderFormItemType;

export default (props: RenderFormItemPropsType) => {
  const { label, widget, rules = [], widgetProps = {}, required, ...restProps } = props;

  const text = widget.includes('AInput')
    ? "请输入"
    : "请选择";
  const defaultRule = required
    ? [
      {
        required,
        message: `${text}${label ?? ''}`,
      },
    ]
    : [];
  const defaultPlaceholder =
    (widget.includes('ADateRangePicker') &&
      (widgetProps as any)?.picker && [
        "开始日期",
        "结束日期",
      ]) ||
    (widget.includes('ADateRangePicker') &&
      !(widgetProps as any)?.picker && [
        "开始日期",
        "结束日期"
      ]) ||
    (widget.includes('ATimePickerRangePicker') && [
      "开始时间",
      "结束时间",
    ]) ||
    `${text}${label ?? ''}`;

  const widgetRules = [...defaultRule, ...rules];

  if (widget === 'ATimePicker' || widget === 'ATimePickerRangePicker') {
    const ATimePickerType = widget.replace('ATimePicker', '');

    const ATimePickerWidget =
      ATimePickerType === ''
        ? AntdJsComponents.ATimePicker
        : AntdJsComponents.ATimePicker[ATimePickerType];

    return (
      <ATimePickerWidget
        label={label}
        rules={widgetRules}
        widgetProps={{
          placeholder: defaultPlaceholder,
          ...widgetProps,
        }}
        {...restProps}
      />
    );
  }

  if (
    widget === 'AInput' ||
    widget === 'AInputTextArea' ||
    widget === 'AInputPassword' ||
    widget === 'AInputNumber'
  ) {
    const AInputType = widget.replace('AInput', '');

    const AInputWidget =
      AInputType === '' ? AntdJsComponents.AInput : AntdJsComponents.AInput[AInputType];

    return (
      <AInputWidget
        label={label}
        rules={widgetRules}
        widgetProps={{
          placeholder: defaultPlaceholder,
          ...widgetProps,
        }}
        {...restProps}
      />
    );
  }

  const WidgetComponent = AntdJsComponents[widget];

  return (
    <WidgetComponent
      label={label}
      rules={widgetRules}
      widgetProps={{
        placeholder: defaultPlaceholder,
        ...widgetProps,
      }}
      {...restProps}
    />
  );
};
