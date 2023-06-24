import React, { Component } from 'react';
import { Row, Col, Empty, Divider } from 'antd';
import styles from './AuxDivider.less';

class AuxDivider extends Component {

  render() {
    const { dataSource } = this.props;
    
    if (!dataSource) {
      return (<Empty description='无数据可操作' />);
    }
    const marginArray = dataSource.margin.split(",");
    const paddingArray = dataSource.padding.split(",");
    let marginStr = '';
    let paddingStr = '';
    marginArray.map((item) => {
      marginStr += ' ' + item + 'px';
    });
    paddingArray.map((item) => {
      paddingStr += ' ' + item + 'px';
    });
    return (
      <Row style={{width:'100%'}}>
        <Col
          span={24} 
          style={{
            background: dataSource.bgColor,
            height: dataSource.height,
            padding: paddingStr
          }}
          className={styles.auxbox}
        >
          {dataSource.type === 'blank'?'':
            <Divider 
              className={styles.auxline}
              style={{borderTopColor: dataSource.lineColor}}
              dashed={dataSource.style==='dashed'}
            />
          }
        </Col>
      </Row>
    );
  }
}


export default AuxDivider;
