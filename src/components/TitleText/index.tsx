/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Row, Col, Space, Divider, Empty } from 'antd';
import classNames from 'classnames';
import Assets from '@/assets/images';
import styles from './TitleText.less';
import BaseUtils from '@/utils/BaseUtils';

class TitleText extends Component {

  spanNum1 = 18;

  spanNum2 = 6;

  render() {
    const { dataSource } = this.props;
    // console.log(dataSource)
    if(!dataSource){
      return (<Empty description='无数据可操作' />);
    }

    /* 
      公共部分参数处理
    */
    if (dataSource.textAlign==="center") {
      this.spanNum1 = 24;
      this.spanNum2 = 0;
    }else{
      if (dataSource.showMore) {
        this.spanNum1 = 18;
        this.spanNum2 = 6;
      }else{
        this.spanNum1 = 24;
        this.spanNum2 = 0;
      }
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
    // ---End

    const onImageClick = (param: any) => {
      // console.log(param);
      BaseUtils.pageJump(param);
    }

    return (
      <Row 
        className={styles.titleText} 
        style={{
          width: '100%',
          backgroundColor: dataSource.bgColor,
          margin: marginStr,
          padding: paddingStr,
          borderRadius: `${dataSource.borderRadius}px`
        }}
      >
        <Col span={this.spanNum1} className={styles.titleTextWrap} style={{textAlign:dataSource.textAlign}}>
          <h1 
            className={styles.titleTextTitle}
            style={{
              fontSize: `${dataSource.titleSize}px`,
              fontWeight: dataSource.weight,
              color: dataSource.titleColor,
              lineHeight: '40px'
            }}
          >
            {
              dataSource.icon!==''?
                <img
                  className={styles.iconImg} 
                  src={dataSource.icon}
                  style={{
                    display: dataSource.showIcon? 'inline-block' : 'none',
                    width:'28px',
                    height: '28px'
                  }}
                />
              :''
            }
            {dataSource.title}
          </h1>
          {dataSource.subtitle ? 
            <p 
              className={styles.titleTextTitleDesc} 
              style={{
                fontSize: `${dataSource.subtitleSize}px`,
                fontWeight: dataSource.subWeight,
                color: dataSource.subtitleColor,
                textAlign:'left'
              }}
            >
              {dataSource.subtitle}
            </p> : ''}
        </Col>
        <Col span={this.spanNum2} className={styles.titleTextLink} hidden={!dataSource.showMore}>
          <Space>
            <span 
              className={styles.titleTextLinkText}
              style={{
                display: dataSource.showMore? 'block' : 'none',
                lineHeight:'18px',
                fontSize: '12px'
              }}
            >{dataSource.moreTitle}</span>
            {/* 右侧箭头 */}
            <div className={styles.titleTextLinkArrow} style={{display:dataSource.showArrow?'block':'none',lineHeight:'18px'}}>
              <img src={Assets.arrowGray} alt="" style={{width:'15px',height:'15px'}} onClick={()=>{onImageClick(dataSource)}}/>
            </div>
          </Space>
        </Col>
        <Divider style={dataSource.divideLine?{margin:0}:{display:'none'}}/>
      </Row>
    );
  }
}


export default TitleText;
