/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { Empty } from 'antd';

import GoodsTemplate1 from '@/components/Goods/Template1';
import GoodsTemplate2 from '@/components/Goods/Template2';
import GoodsTemplate3 from '@/components/Goods/Template3';
import GoodsTemplate4 from '@/components/Goods/Template4';
import GoodsTemplate5 from '@/components/Goods/Template5';
import GoodsTemplate6 from '@/components/Goods/Template6';

class Goods extends Component {

  renderContent = (data) => {
    if (data.template === 'template1') {
      return <GoodsTemplate1 dataSource={data} />
    }
    if (data.template === 'template2') {
      return <GoodsTemplate2 dataSource={data} />
    }
    if (data.template === 'template3') {
      return <GoodsTemplate3 dataSource={data} />
    }
    if (data.template === 'template4') {
      return <GoodsTemplate4 dataSource={data} />
    }
    if (data.template === 'template5') {
      return <GoodsTemplate5 dataSource={data} />
    }
    if (data.template === 'template6') {
      return <GoodsTemplate6 dataSource={data} />
    }
  }

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }
    return (
      <>
      {this.renderContent(dataSource)}
      </>
    );
  }
}


export default Goods;
