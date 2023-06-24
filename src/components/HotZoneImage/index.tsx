/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Row, Col, Empty, Input } from 'antd';
import classNames from 'classnames';
import './index.less';

class HotZoneImage extends Component {

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }

    return (
        <img src={dataSource.image} style={{width:'100%',maxHeight:'520px'}} />
    );
  }
}


export default HotZoneImage;
