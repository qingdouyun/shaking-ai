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

class ProductTemplate4 extends Component {

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }

    return (
      <>
        <div
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
              dataSource.goods.map((item, index)=>{
                return (
                  <Row key={index} className="productRow temp4-productRow" style={{padding:'10px 0'}} onClick={()=>{history.push('/goods/detail/' + item.key);}}>
                    <Col span={4} className={styles.item}>
                      <div className={styles.picture}>
                        <img style={{display:'block',width:'100%'}} src={item.image} alt="商品图片"/>
                      </div>
                    </Col>
                    <Col 
                      span={20} 
                      className={styles.item} 
                      style={{
                        boxSizing:'border-box',padding:'10px'
                      }}
                    >
                      <div style={{width:'100%',display:'flex',flexFlow:'column'}}>
                        <p 
                          className="title dot1" 
                          style={{
                            lineHeight:'20px',paddingBottom:'0px',height:'25px',textAlign:'left',fontWeight:'normal',fontSize:'15px'
                          }}
                        >{item.name}</p>
                        <p className="tag-wrap" style={{minHeight:'16px',width:'100%'}}>
                          {
                              typeof item.tags !== "undefined"?item.tags&&item.tags.map((itm, index) => {
                                return (
                                  <em style={{
                                    color: itm.color,
                                    background:itm.bgColor,
                                    display: 'inline-block',
                                    borderRadius: '0',
                                    textAlign: 'center',
                                    marginTop:'5px',
                                    height: '20px',
                                    lineHeight: '20px',
                                    fontSize: '13px',
                                    marginRight: '5px',
                                  }} className="tag-item" key={index}>{itm.name}</em>
                                )
                              })
                              :''
                          }
                        </p>
                      </div>
                      <Row style={{width:'100%',padding:'0'}}>
                        <Col span={20} className={styles.priceCol}>
                          <p className="price" style={{fontWeight:'bold',color:'#000000',width:'auto'}}>
                            <em className="tag" style={{left:'0',fontWeight:'bold',color:'#000000',width:'auto',position:'initial',fontSize:'16px'}}>¥{item.price}</em>
                            {/* <em style={{color:'#C35355', marginLeft:'5px',fontSize:'12px'}}>市场价：<s className="delete" style={{fontWeight:'normal',fontSize:'12px',marginLeft:'5px'}}>{item.marketPrice}</s></em> */}
                          </p>
                        </Col>
                        <Col span={4} className="cart" style={{justifyContent:'flex-end',display:'flex',alignItems:'center'}}>
                          <p className={styles.sales} style={{fontSize:'13px'}}>已售{item.sales}件</p>
                          <div className="self-icon-wrap" style={{width:'20px',height:'20px',background:"none",border:"none"}} hidden={!dataSource.hideCartIcon}>
                            <img src={dataSource.cartIcon} style={{width:"20px",height:"20px"}} />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              })
            :''
          }
        </div>
      </>
    );
  }
}


export default ProductTemplate4;
