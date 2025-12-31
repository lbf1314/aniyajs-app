import type { AInputPropsType } from '@aniyajs/components/es/form/ainput/input';
import type { AInputNumberPropsType } from '@aniyajs/components/es/form/ainput/number';
import type { AInputPasswordPropsType } from '@aniyajs/components/es/form/ainput/password';
import type { AInputTextAreaPropsType } from '@aniyajs/components/es/form/ainput/textarea';
import type { ACascaderPropsType } from '@aniyajs/components/es/form/acascader';
import type { ACheckboxGroupPropsType } from '@aniyajs/components/es/form/acheckboxgroup';
import type { ADatePickerPropsType } from '@aniyajs/components/es/form/adatepicker';
import type { ADateRangePickerPropsType } from '@aniyajs/components/es/form/adaterangepicker';
import type { ARadioGroupPropsType } from '@aniyajs/components/es/form/aradiogroup';
import type { ASelectPropsType } from '@aniyajs/components/es/form/aselect';
import type { ASwitchPropsType } from '@aniyajs/components/es/form/aswitch';
import type { ATreePropsType } from '@aniyajs/components/es/form/atree';
import type { AUploadPropsType } from '@aniyajs/components/es/form/aupload';
import type { ASliderPropsType } from '@aniyajs/components/es/form/aslider';
import type { ATimePickerPropsType } from '@aniyajs/components/es/form/atimepicker/timepicker';
import type { ATimeRangePickerPropsType } from '@aniyajs/components/es/form/atimepicker/timerangepicker';
import type { ATreeSelectPropsType } from '@aniyajs/components/es/form/atreeselect';
import type { AAutoCompletePropsType } from '@aniyajs/components/es/form/aautocomplete';
import type { ARatePropsType } from '@aniyajs/components/es/form/arate';

export interface AInputWidgetProps extends AInputPropsType {
  widget: 'AInput';
  required?: boolean;
}

export interface AInputPasswordWidgetProps extends AInputPasswordPropsType {
  widget: 'AInputPassword';
  required?: boolean;
}

export interface AInputTextAreaWidgetProps extends AInputTextAreaPropsType {
  widget: 'AInputTextArea';
  required?: boolean;
}
export interface AInputNumberWidgetProps extends AInputNumberPropsType {
  widget: 'AInputNumber';
  required?: boolean;
}
export type ACascaderWidgetProps = ACascaderPropsType & {
  widget: 'ACascader';
  required?: boolean;
};
export interface ACheckboxGroupWidgetProps extends ACheckboxGroupPropsType {
  widget: 'ACheckboxGroup';
  required?: boolean;
}
export interface ADatePickerWidgetProps extends ADatePickerPropsType {
  widget: 'ADatePicker';
  required?: boolean;
}
export interface ADateRangePickerWidgetProps extends ADateRangePickerPropsType {
  widget: 'ADateRangePicker';
  required?: boolean;
}
export interface ARadioGroupWidgetProps extends ARadioGroupPropsType {
  widget: 'ARadioGroup';
  required?: boolean;
}
export interface ASelectWidgetProps extends ASelectPropsType {
  widget: 'ASelect';
  required?: boolean;
}
export interface ASwitchWidgetProps extends ASwitchPropsType {
  widget: 'ASwitch';
  required?: boolean;
}
export interface ATreeWidgetProps extends ATreePropsType {
  widget: 'ATree';
  required?: boolean;
}
export interface AUploadWidgetProps extends AUploadPropsType {
  widget: 'AUpload';
  required?: boolean;
}

export interface ASliderWidgetProps extends ASliderPropsType {
  widget: 'ASlider';
  required?: boolean;
}

export interface ATimePickerWidgetProps extends ATimePickerPropsType {
  widget: 'ATimePicker';
  required?: boolean;
}
export interface ATimePickerRangePickerWidgetProps extends ATimeRangePickerPropsType {
  widget: 'ATimePickerRangePicker';
  required?: boolean;
}
export interface ATreeSelectWidgetProps extends ATreeSelectPropsType {
  widget: 'ATreeSelect';
  required?: boolean;
}

export interface AAutoCompleteWidgetProps extends AAutoCompletePropsType {
  widget: 'AAutoComplete';
  required?: boolean;
}

export interface ARateWidgetProps extends ARatePropsType {
  widget: 'ARate';
  required?: boolean;
}

export type RenderFormItemType = {
  required?: boolean;
} & (
  | AInputWidgetProps
  | AInputPasswordWidgetProps
  | AInputTextAreaWidgetProps
  | AInputNumberWidgetProps
  | ACascaderWidgetProps
  | ACheckboxGroupWidgetProps
  | ADatePickerWidgetProps
  | ADateRangePickerWidgetProps
  | ARadioGroupWidgetProps
  | ASelectWidgetProps
  | ASwitchWidgetProps
  | ATreeWidgetProps
  | AUploadWidgetProps
  | ASliderWidgetProps
  | ATimePickerWidgetProps
  | ATimePickerRangePickerWidgetProps
  | ATreeSelectWidgetProps
  | AAutoCompleteWidgetProps
  | ARateWidgetProps
);
