import React from 'react';
import { Button as ButtonAntd } from 'antd';
import Styles from './index.module.less';
import cx from 'classnames';

interface Props {
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'logOut';
  /** 文本 */
  text: string;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 文字颜色 */
  color?: string;
  /** 背景色颜色 */
  background?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载中 */
  loading?: boolean;
  /** 块级 */
  block?: boolean;
  /** 自定义样式 */
  className?: any;
  /** 点击事件 */
  onPress?: () => void;
}

ButtonCom.defaultProps = {
  type: 'default',
  width: 0,
  height: 0,
  loading: false,
  disabled: false,
  block: false,
  color: '#000000'
};

function ButtonCom(props: Props) {

  const handleClick = () => {
    if(!props.disabled) {
      props?.onPress()
    }
  }

  return (
    <ButtonAntd
      onClick={handleClick}
      loading={props?.loading}
      // disabled={props?.disabled}
      className={cx({
        [Styles.button]: true,
        [Styles.primary]: props.type === 'primary',
        [Styles.default]: props.type === 'default',
        [Styles.logOut]: props.type === 'logOut',
        [props.className]: !!props.className
      })}
      style={{
        fontSize:'15px',
        color: props.color,
        padding: 0,
        backgroundColor: props.background,
        width: props?.width ? props?.width : props.block ? '100%' : 'auto',
        height: props?.height ? props?.height : 'auto',
        borderColor: props.type === 'logOut' ? '#f0f0f0' : 'rgba(0, 0, 0, 0)'
      }}
      block={props?.block}
    >
      {props?.text}
    </ButtonAntd>
  );
}

export default ButtonCom;
