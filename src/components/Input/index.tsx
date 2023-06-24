import React, {useEffect} from 'react';
import {Input} from 'antd';
import cx from 'classnames';
import Styles from './index.module.less';

interface Props {
  /** ref */
  ref?: any
  /** 值 */
  value?: string
  /** 类型 */
  type?: string
  /** 提示文本 */
  placeholder?: string
  /** 提示文本颜色 */
  placeholderColor?: string
  /** 是否存在下划线 */
  borderBottom: boolean
  /** 字体大小 */
  fontSize?: number
  /** 是否启用清空 */
  clearable: boolean
  /** class */
  classname?: any
  /** 最大字符 */
  maxLength?: number
  /** 是否只读 */
  readOnly?: boolean
  /** 后缀内容 */
  extra?: any
  /** 输入改变回调 */
  onChange?: (value: any) => void
  /** 回车回调 */
  onEnterPress?: () => void
}

InputCom.defaultProps = {
  type: 'text',
  placeholder: '',
  fontSize: 14,
  maxLength: 200,
  readOnly: false,
  clearable: false,
  placeholderColor: '',
  borderBottom: false,
  classname: ''
};

function InputCom(props: Props) {
  const handleChange = (value: string) => {
    props?.onChange?.(value)
  }
  const handleEnter = (e: any) => {
    props?.onEnterPress?.()
  }

  return (
    <div
      className={cx({
        [Styles.container]: true,
        [props.classname]: true
      })}
    >
      <div
        className={cx({
          [Styles.inputWrapper]: true,
          [Styles.borderBottom]: props?.borderBottom,
          [Styles.search]: props?.type === 'search'
        })}
      >
        <Input
          value={props?.value}
          type={props?.type === 'search' ? 'text' : props?.type}
          placeholder={props?.placeholder}
          clearable={props?.clearable}
          readOnly={props?.readOnly}
          maxLength={props?.maxLength}
          className={Styles.input}
          onChange={handleChange}
          onEnterPress={handleEnter}
        />
        {props?.extra && props.extra}
      </div>
    </div>
  );
}

export default InputCom;
