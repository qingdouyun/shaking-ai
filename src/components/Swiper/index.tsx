/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Row, Col, Space, Divider, Empty } from 'antd';
import classNames from 'classnames';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { history } from 'umi';
import './Swiper.less';
import JumpType from '@/constants/JumpType';
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';


const Swiper = (props: any) => {
  const { dataSource } = props;
  let counter = 1;
  const token = Cookies.get('token');

  const settings = {
    dots: true,
    dotsClass: "slick-dots custom-indicator",
    customPaging: function(i: number) {
      if (dataSource.indicator==='dot') {
        return (<button className="indicator-dot">{i+1}</button>);
      }else if (dataSource.indicator==='line') {
        return (<div className="indicator-line"></div>);
      }else if (dataSource.indicator==='square') {
        return (<div className="indicator-square">{i+1}</div>);
      }else if (dataSource.indicator==='circle') {
        return (<></>);
      }
    },
    appendDots: (dots: any) => {
      if (dataSource.indicator==='circle') {
        return <div style={{
          background:'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          right: '15px',
          bottom: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}>
          <span style={{color:'#000000',fontSize:'12px'}}>{counter}/<em style={{color:'gray'}}>{dataSource.items.length}</em></span>
        </div>;
      }else{
        return <ul>{dots}</ul>;
      }
    },
    afterChange: page => {
      counter = page + 1;
    },
    autoplay: true,
    autoplaySpeed: 2000,
    className: "center",
    centerMode: dataSource.template==='carousel',//旋转木马
    infinite: true,
    centerPadding: dataSource.template==='carousel'?'10px':'0',
    slidesToShow: 1,
    speed: 500,
    nextArrow: <></>,
    prevArrow: <></>
  };
  if(!dataSource){
    return (<Empty description='无数据可操作' />);
  }
  const marginArray = dataSource.margin.split(",");
  const paddingArray = dataSource.padding.split(",");
  let marginStr = '';
  let paddingStr = '';
  marginArray.map((item: any) => {
    marginStr += ' ' + item + 'px';
  });
  paddingArray.map((item: any) => {
    paddingStr += ' ' + item + 'px';
  });
  
  //图片点击事件
  const onImageClick = (param: any) => {
    // console.log(param);
    BaseUtils.pageJump(param);
  }

  //渲染图片
  const renderPreviewImages = () => {
    let content = {};
    if(dataSource.items){
      content = dataSource.items.map((item,index) => {
        return <div key={index} onClick={()=>{onImageClick(item)}} style={{borderRadius:`${dataSource.borderRadius}px`}}>
                <div style={{paddingRight:`${dataSource.carouselImageSpace}px`}}>
                  <img className='image' style={{display:'initial',borderRadius:`${dataSource.borderRadius}px`}} src={item.filePath} />
                </div>
              </div>;
      });
    }else{
      content = <div><div style={{paddingRight:`${dataSource.carouselImageSpace}px`}}><img className='image' src={item.defaultImage} /></div></div>;
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
        <Slider {...settings} className="hhz-slider-wrap">
          {renderPreviewImages()}
        </Slider>
      </Col>
    </Row>
  );
}


export default Swiper;
