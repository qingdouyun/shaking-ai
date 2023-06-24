import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Row, Col, Space, Divider, Empty } from 'antd';
import classNames from 'classnames';
import styles from './ImageCube.less';
import { history } from 'umi';
import JumpType from '@/constants/JumpType';
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';

const ImageCube = (props: any) => {
  const { dataSource } = props;
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
  const token = Cookies.get('token');

  //图片点击事件
  const onImageClick = (param: any) => {
    BaseUtils.pageJump(param);
  }

  const renderPreviewImages = () => {
    let content = <></>;
    if(dataSource.images){
      const {images} = dataSource;
      switch (dataSource.template) {
        case 'yihangyige':
          content = dataSource.images.map((item,index) => {
            return <div key={index} onClick={()=>{onImageClick(item)}}><img className={styles.image} src={item.filePath} /></div>;
          });
          break;
        case 'yihangliangge':
          content = <Row>
                      {dataSource.images.map((item,index) => {
                        return <Col key={index} span={12} onClick={()=>{onImageClick(item)}}><img className={styles.image} src={item.filePath} /></Col>;
                      })}
                    </Row>;
          break;
        case 'yihangsange':
          content = <Row>
                      {dataSource.images.map((item,index) => {
                        return <Col key={index} span={8} onClick={()=>{onImageClick(item)}}><img className={styles.image} src={item.filePath} /></Col>;
                      })}
                    </Row>;
          break;
        case 'yihangsige':
          content = <Row>
                      {dataSource.images.map((item,index) => {
                        return <Col key={index} span={6} onClick={()=>{onImageClick(item)}}><img className={styles.image} src={item.filePath} /></Col>;
                      })}
                    </Row>;
          break;
        case 'liangzuoliangyou':
          content = <Row>
                      {dataSource.images.map((item,index) => {
                        return <Col key={index} span={12} onClick={()=>{onImageClick(item)}}><img className={styles.image} src={item.filePath} /></Col>;
                      })}
                    </Row>;
          break;
        case 'yizuoliangyou':
          content = <Row>
                      <Col 
                          span={12}
                          style={{height:'320px'}}
                          onClick={()=>{onImageClick(images[0])}}
                      >
                          <img className={styles.image} src={images.length>0?images[0].filePath:""} />
                      </Col>
                      <Col span={12} style={{height:'320px'}}>
                          <Row>
                              <Col 
                                  span={24}
                                  style={{height:'160px'}}
                                  onClick={()=>{onImageClick(images[1])}}
                              >
                                  <img className={styles.image} src={images.length>1?images[1].filePath:""} /> 
                              </Col>
                              <Col 
                                  span={24}
                                  style={{height:'160px'}}
                                  onClick={()=>{onImageClick(images[2])}}
                              >
                                  <img className={styles.image} src={images.length>2?images[2].filePath:""} /> 
                              </Col>
                          </Row>
                      </Col>
                    </Row>
          break;
        case 'yishangliangxia':
          content = <Row>
                      <Col 
                          span={24}
                          style={{height:'160px',marginRight:'0px'}}
                          onClick={()=>{onImageClick(images[0])}}
                      >
                        <img className={styles.image} src={images.length>0?images[0].filePath:""} /> 
                      </Col>
                      <Col span={24} style={{height:'160px'}}>
                          <Row>
                              <Col 
                                  span={12}
                                  style={{height:'160px',marginRight:'0px'}}
                                  onClick={()=>{onImageClick(images[1])}}
                              >
                                  <img className={styles.image} src={images.length>1?images[1].filePath:""} />
                              </Col>
                              <Col 
                                  span={12}
                                  style={{height:'160px',marginRight:'0px'}}
                                  onClick={()=>{onImageClick(images[2])}}
                              >
                                  <img className={styles.image} src={images.length>2?images[2].filePath:""} />
                              </Col>
                          </Row>
                      </Col>
                    </Row>
          break;
        case 'yizuosanyou':
          content = <Row>
                      <Col 
                          span={12}
                          style={{height:'320px'}}
                          onClick={()=>{onImageClick(images[0])}}
                      >
                          <img className={styles.image} src={images.length>0?images[0].filePath:""} /> 
                      </Col>
                      <Col span={12} style={{height:'320px'}}>
                          <Row>
                              <Col 
                                  span={24}
                                  style={{height:'160px',marginRight:'0px'}}
                                  onClick={()=>{onImageClick(images[1])}}
                              >
                                  <img className={styles.image} src={images.length>1?images[1].filePath:""} />
                              </Col>
                              <Col span={24} style={{height:'160px'}}>
                                  <Row>
                                      <Col 
                                          span={12}
                                          style={{height:'160px',marginRight:'0px'}}
                                          onClick={()=>{onImageClick(images[2])}}
                                      >
                                          <img className={styles.image} src={images.length>2?images[2].filePath:""} /> 
                                      </Col>
                                      <Col 
                                          span={12}
                                          style={{height:'160px',marginRight:'0px'}}
                                          onClick={()=>{onImageClick(images[3])}}
                                      >
                                          <img className={styles.image} src={images.length>3?images[3].filePath:""} /> 
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                      </Col>
                    </Row>
          break;
        default:
          break;
      }
    }else{
      content = <img className={styles.image} src='https://cdn.pro.shakingcloud.com/wyy/decorate/imagecube.png' />;
    }
    return content;
  }

  return (
    <Row
      style={{
        width:'100%',
        backgroundColor: dataSource.bgColor,
        margin: marginStr,
        padding: paddingStr,
        borderRadius: `${dataSource.borderRadius}px`
      }}
    >
      <Col span={24}>
        {renderPreviewImages()}
      </Col>
    </Row>
  );
}


export default ImageCube;
