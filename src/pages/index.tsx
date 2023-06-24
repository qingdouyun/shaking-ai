import React, { useEffect, useRef, useState } from 'react';
import { history } from "umi";
import { message, Spin } from 'antd';
import api from '@/services/api';

import Notice from '@/components/Notice';
import Swiper from '@/components/Swiper';
import AuxDivider from '@/components/AuxDivider';
import TitleText from '@/components/TitleText';
import ImageTextNav from '@/components/ImageTextNav';
import HotZoneImage from '@/components/HotZoneImage';
import ImageMagicCube from '@/components/ImageMagicCube';
import Video from '@/components/Video';
import Goods from '@/components/Goods';
import ArticleHorizontalTabs from '@/components/ArticleTabs/HorizontalTabs';
import GoodsHorizontalTabs from '@/components/GoodsTabs/HorizontalTabs';
import Articles from '@/components/Articles';
import Prompts from '@/components/Prompts';
import RichText from '@/components/RichText';

import BaseUtils from '@/utils/BaseUtils';


const IndexPage = (props: any) => {
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息
  

  const [data, setData] = useState({
    'title': '首页',
    'logo': '',
    'header': {
      'navigations': []
    },
    'body': []
  });
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (BaseUtils.isEmpty(appInfo) || appInfo.expired < Date.now()) {
      api.app.getInfo({}).then((response: any) => {
        if (response.success) {
          response.data.expired = Date.now() + 30 * 60 * 1000;
          localStorage.setItem('appInfo', JSON.stringify(response.data));
          setAppInfo(response.data);
        } else {
          message.error(response.msg);
        }
      });
    }
    //电脑端首页
    api.app.getHome({ 'type': 'computer' }).then((response: any) => {
      setLoading(false);
      if (response?.success) {
        setData(response.data);
        localStorage.setItem('logo', response.data.logo);

        localStorage.setItem('currentWindow',JSON.stringify({'title': response.data.title,'subtitle': response.data.description}));

        //localStorage.setItem('navigations',JSON.stringify(response.data.header.navigations));
      } else {
        message.error(response?.msg);
      }
    });
  }, []);

  /**
   * 监听组件编辑时，内容改变
   * @param {*} key 传组件对象的 dragableId 便于区别新老数据
   * @param {*} fieldNames 字段名[支持多字段]
   * @param {*} fieldValues 字段值[支持多字段]
   * @param {fieldName,fieldValue} extra 子节点数据【修改子集的话，父级的fieldNames和fieldValues不填】
   */
  const onComponentsContentChange = (key, fieldNames, fieldValues, extra) => {
    // 修改单个对象属性 let tmpData = Object.assign(dataSource,{titleColor: color.hex});
    if (key === null || key === undefined || key === '') {
      return;
    }
    // console.log('==='+key);
    const tmpBody = [...data.body];
    // console.log(tmpDatas);
    tmpBody.forEach((item: any) => {
      if (item.key === key) {
        if (fieldNames !== null && fieldNames !== undefined && fieldNames !== '') {
          if (Array.isArray(fieldNames)) {
            for (let index = 0; index < fieldNames.length; index++) {
              item[fieldNames[index]] = fieldValues[index];
            }
          } else {
            item[fieldNames] = fieldValues;
          }
        }
        if (extra !== null && extra !== undefined && extra !== '') {
          // 支持数组或单对象完全覆盖
          item[extra.fieldName] = extra.fieldValue;
        }
      }
    });
    const tmpData = { ...data };
    tmpData.body = tmpBody;
    setData(tmpData);
  }

  // 渲染页面组件
  const renderPageComponents = (item: any) => {
    if (item.componentId === 'Notice') {
      return (<Notice dataSource={item} />);
    }
    if (item.componentId === 'Swiper') {
      return (<Swiper dataSource={item} />);
    }
    if (item.componentId === 'AuxDivider') {
      return (<AuxDivider dataSource={item} />);
    }
    if (item.componentId === 'TitleText') {
      return (<TitleText dataSource={item} />);
    }
    if (item.componentId === 'HotZoneImage') {
      return (<HotZoneImage dataSource={item} />);
    }
    if (item.componentId === 'ImageTextNav') {
      return (<ImageTextNav dataSource={item} />);
    }
    if (item.componentId === 'ImageMagicCube') {
      return (<ImageMagicCube dataSource={item} />);
    }
    if (item.componentId === 'Video') {
      return (<Video dataSource={item} />);
    }
    if (item.componentId === 'Goods') {
      return (<Goods dataSource={item} />);
    }
    if (item.componentId === 'ArticleHorizontalTabs') {
      return (<ArticleHorizontalTabs dataSource={item} onChange={onComponentsContentChange} />);
    }
    if (item.componentId === 'GoodsHorizontalTabs') {
      return (<GoodsHorizontalTabs dataSource={item} onChange={onComponentsContentChange} />);
    }
    if (item.componentId === 'Articles') {
      return (<Articles dataSource={item} />);
    }
    if (item.componentId === 'Prompts') {
      return (<Prompts dataSource={item} />);
    }
    if (item.componentId === 'RichText') {
      return (<RichText dataSource={item} />);
    }
    return '';
  }

  return (
    <Spin spinning={loading}>
      {/* 页面内容 */}
      <div>
        {data.body.map((item: any) => {
          return (<div key={item.key}>{renderPageComponents(item)}</div>)
        })}
      </div>
    </Spin>
  );
};

export default IndexPage;