/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Row, Col, Empty, Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import './index.less';
import Common from '@/utils/Common';
import { history } from '@umijs/max';

// addPx
const common = new Common();

class ProductTemplate3 extends Component {

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }

    return (
      <Row 
        className={styles.productRow} 
        gutter={16} 
        style={{
          width: '100%',
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
                <Col key={index} span={6} className="temp6-list" style={{flex:'0 0 23.5%',padding:'0',display:'block',marginBottom:'10px'}} onClick={()=>{history.push('/goods/detail/' + item.key);}}>
                  <div className="picture" style={{height:'auto'}}>
                    <img style={{width:'100%',display:'block'}} src={item.image} alt="商品图片"/>
                  </div>
                  <div 
                    style={{padding:'5px',background:'#ffffff'}}
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
                    <p className={styles.sales} style={{marginTop:'0',fontSize:'12px'}}>已售{item.sales}件</p>
                    <Row style={{width:'100%',padding:'0'}}>
                      <Col span={19} className={styles.priceCol}>
                        <p className="price" style={{fontWeight:'bold',color:'#000000',width:'auto'}}>
                          <em className="tag" style={{left:'0',fontWeight:'bold',color:'#000000',width:'auto',position:'initial',fontSize:'16px'}}>¥&nbsp;{item.price}</em>
                        </p>
                      </Col>
                      <Col span={5} className="cart" style={{justifyContent:'flex-end',display:'flex',alignItems:'center'}}>
                        <div className="self-icon-wrap" style={{width:'20px',height:'20px',background:"none",border:"none"}} hidden={!dataSource.hideCartIcon}>
                          <img src={dataSource.cartIcon} style={{width:"20px",height:"20px"}} />
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


export default ProductTemplate3;
