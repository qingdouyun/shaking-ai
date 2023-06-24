
import React, { Component } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Row, Col, Empty, Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { history } from 'umi';
import Common from '@/utils/Common';

// addPx
const common = new Common();

class ProductTemplate5 extends Component {

  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }

    return (
      <Row className={styles.productRow} gutter={6} style={{
          width: '100%',
          flexFlow:'row',overflowX:'auto',
          boxSizing:'border-box',
          background: dataSource.bgColor,
          borderRadius: dataSource.borderRadius+'px',
          margin: common.addPx(dataSource.margin),
          padding: common.addPx(dataSource.padding)
      }}>
        {
          dataSource.goods.length>0?
            dataSource.goods.map((item,index) => {
              return (
                <Col key={index} span={8} className={styles.item} style={{paddingLeft:'0px'}} onClick={()=>{history.push('/goods/detail/' + item.key);}}>
                  <div className={styles.picture}>
                    <img style={{width:'100%',display:'block'}} src={item.image} alt="商品图片"/>
                  </div>
                  <div style={{background:'#ffffff',padding:'5px',width:'100%'}}>
                      <p 
                        className="title dot1" 
                        style={{
                          lineHeight:'30px',paddingBottom:'0px',color:'#333333',marginBottom:'0',height:'30px',textAlign:'left',
                          overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-flex',fontSize:'15px'
                        }}
                      >{item.name}</p>
                      <p className={styles.sales} style={{marginTop:'5px',padding:'0',fontSize:'12px'}}>已售{item.sales}件</p>
                      <Row style={{width:'100%',padding:'0'}}>
                        <Col span={19} className={styles.priceCol}>
                          <p className="price" style={{fontWeight:'bold',color:'#000000',width:'auto',lineHeight:0,margin:0}}>
                            <em className="tag" style={{left:'0',fontWeight:'bold',color:'#000000',width:'auto',position:'initial',fontSize:'16px'}}>¥{item.price}</em>
                          </p>
                        </Col>
                        <Col span={5} className="cart" style={{justifyContent:'flex-end',display:'flex',alignItems:'center'}} hidden={!dataSource.hideCartIcon}>
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


export default ProductTemplate5;
