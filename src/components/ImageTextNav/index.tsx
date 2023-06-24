import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Space, Divider, Empty } from 'antd';
import classNames from 'classnames';
import styles from './ImageTextNav.less';
import { history } from 'umi';
import JumpType from '@/constants/JumpType';
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';


const ImageTextNav =(props: any) => {
  const { dataSource } = props;
  const token = Cookies.get('token');
  const { navigations,cols } = dataSource;
  const widthStr = Number(100/parseInt(cols)).toFixed(3) + '%';

  //公共属性 --start
  const marginArray = dataSource.margin.split(",");
  const paddingArray = dataSource.padding.split(",");
  let marginStr = "";
  let paddingStr = "";
  marginArray.map((item) => {
    marginStr += " " + item + "px";
  });
  paddingArray.map((item) => {
    paddingStr += " " + item + "px";
  });
    //公共属性 -- end
 
  //菜单点击事件
  const onMenuClick = (param: any) => {
    BaseUtils.pageJump(param);
  }

  const renderPreviewImages = () => {
    let data;
    if (navigations) {
      data = navigations.map((item, index) => {
        return (
          <div 
            style={{
              width:widthStr,display:'flex',alignItems:'center',flexDirection:'column', 
              height:navigations.height+"px",justifyContent:'center'
            }}
            key={index}
            onClick={()=>{onMenuClick(item)}}
          >
            {
            dataSource.template==='picture' ? 
              <img 
                className={styles.image} 
                src={item.icon!==''?item.icon:'https://cdn.pro.shakingcloud.com/wyy/decorate/default-small.png'}
                style={{width:item.width+"px",height:item.height+"px"}}
              /> 
            :
            ''
            }
            <p className={styles.title} style={
              dataSource.template==='text'?
              {margin:'0',lineHeight:'40px',fontSize:'14px'}
              :
              {fontSize:'14px'}
            }>{item.title}</p>
          </div>
        );
      });
    }
    return data;
  }

  return (
    <div className={
        dataSource.style==='roll'?
        styles.rollNav
        :
        styles.fixedNav
      }
      style={{
        width:'100%',
        background: dataSource.bgColor,
        margin: marginStr,
        padding: paddingStr,
        borderRadius: `${dataSource.borderRadius}px`,
        height:dataSource.height
      }}
    >
      {renderPreviewImages()}
    </div>
  );
}


export default ImageTextNav;
