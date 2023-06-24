/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Row, Col, Empty, Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import './index.less';
import { history } from 'umi';
import Common from '@/utils/Common';

// addPx
const common = new Common();

class ProductTemplate2 extends Component {

  render() {
    const { dataSource } = this.props;

    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }

    return (
      <Row 
        className={styles.productRow}
        style={{
          boxSizing:'border-box',
          background: dataSource.bgColor,
          borderRadius: dataSource.borderRadius+'px',
          margin: common.addPx(dataSource.margin),
          padding: common.addPx(dataSource.padding)
        }}
      >
        {
          dataSource.goods.length>0?
            dataSource.goods.map((item, index) => {
              return (
                <Col key={index} span={12} className={styles.item} style={{flex:'0 0 49%',marginBottom:'10px'}} onClick={()=>{history.push('/goods/detail/' + item.key);}}>
                  <div className="picture" style={{height:'auto'}}>
                    <img style={{width:'100%',display:'block'}} src={item.image} alt="商品图片"/>
                  </div>
                  <div 
                    style={{padding:'10px'}}
                  >
                    <p 
                      className="title dot1" 
                      style={{
                        lineHeight:'25px',paddingBottom:'5px',textAlign:'left',fontSize:'15px'
                      }}
                    >{item.name}</p>
                    <p className="tag-wrap">
                      {
                          typeof item.tags !== "undefined"?item.tags&&item.tags.map((itm, index) => {
                            return (
                              <em style={{
                                color: itm.color,
                                background:itm.bgColor,
                                display: 'inline-block',
                                borderRadius: '0',
                                textAlign: 'center',
                                height: '20px',
                                lineHeight: '20px',
                                fontSize: '12px',
                                marginRight: '5px',
                              }} className="tag-item" key={index}>{itm.name}</em>
                            )
                          })
                          :''
                      }
                    </p>
                    <p className={styles.sales} style={{margin:'0',fontSize:'12px'}}>已售{item.sales}件</p>
                    <Row style={{width:'100%',padding:'0'}}>
                      <Col span={20} className={styles.priceCol}>
                        <p className="price" style={{fontWeight:'bold',color:'#000000',width:'auto',lineHeight:0,margin:0}}>
                          <em className="tag" style={{left:'0',fontWeight:'bold',color:'#000000',width:'auto',position:'initial',fontSize:'16px'}}>¥&nbsp;{item.price}</em>
                          {/* <em style={{color:'#C35355', marginLeft:'5px',fontSize:'12px'}}>市场价：<s className="delete" style={{fontWeight:'normal',fontSize:'12px',marginLeft:'5px'}}>{item.marketPrice}</s></em> */}
                        </p>
                      </Col>
                      <Col span={4} className="cart" style={{justifyContent:'flex-end',display:'flex',alignItems:'center'}}>
                        <div className="self-icon-wrap" style={{width:'30px',height:'30px',background:"none",border:"none"}} hidden={!dataSource.hideCartIcon}>
                          <img src={dataSource.cartIcon} style={{width:"30px",height:"30px"}} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )
            })
          :''
        }
      </Row>
    );
  }
}


export default ProductTemplate2;
