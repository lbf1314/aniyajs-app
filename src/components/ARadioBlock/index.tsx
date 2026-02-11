import React, { Key } from 'react';
import styles from "./index.module.less";

export interface ARadioBlockPropsType {
  value?: Key;
  onChange?: (value: Key) => void;
}

const enums = [
  {
    label: "Cosplay",
    value: "1"
  },
  {
    label: "写真",
    value: "2"
  },
  {
    label: "头像",
    value: "3"
  }
]

const ARadioBlock: React.FC<ARadioBlockPropsType> = (props) => {
  const { value, onChange } = props;

  const clickHandle = (value: Key) => {
    onChange?.(value);
  }

  return (
    <div className={styles.aRadioBlock}>
      {
        enums?.map((item) => <div key={item?.value} onClick={() => clickHandle(item?.value)} className={`${styles.aRadioBlockItem} ${(value === item?.value) ? styles.aRadioBlockItem_active : ''}`}>{item?.label}</div>)
      }
    </div>
  );
};

export default ARadioBlock;