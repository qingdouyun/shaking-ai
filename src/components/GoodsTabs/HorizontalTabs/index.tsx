import React, { Component, useEffect, useState } from 'react';
import { SortAscendingOutlined } from '@ant-design/icons';
import { Row, Col, Empty, Input, message, Divider } from 'antd';
import classNames from 'classnames';
import styles from './HorizontalTabs.less';
import IconFont from '@/components/IconFont';
import api from '@/services/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import Common from '@/utils/Common';

import GoodsTemplate1 from '@/components/GoodsTabs/HorizontalTabs/Template1';
import GoodsTemplate2 from '@/components/GoodsTabs/HorizontalTabs/Template2';
import GoodsTemplate3 from '@/components/GoodsTabs/HorizontalTabs/Template3';
import GoodsTemplate4 from '@/components/GoodsTabs/HorizontalTabs/Template4';
import GoodsTemplate5 from '@/components/GoodsTabs/HorizontalTabs/Template5';
import GoodsTemplate6 from '@/components/GoodsTabs/HorizontalTabs/Template6';


// addPx
const common = new Common();

const HorizontalTabs = (props:any) => {
  const { dataSource } = props;
  const [activeTab, setActiveTab] = useState({
    'key':'',
    'type':'',
    'content': {
      'goods': []
    },
    'totalCount': 0
  });

  const refreshTabGoodsList = (tabKey: string, goodsList: any, pageNumber: number, totalCount: number) =>{
      const extra = {};
      const newTabs = Object.assign([], dataSource.tabs);
      newTabs.map((item: any)=>{
          if (item.key === tabKey) {
              const tmpData = [...item.content.goods];
              item.checked = true;
              item.totalCount = totalCount;
              item.pageNumber = pageNumber;
              if (pageNumber === 1) {
                  item.content.goods = goodsList;
              }else{
                  item.content.goods = tmpData.concat(goodsList);
              }
          }else{
              item.checked = false;
          }
      })
      extra.fieldName = "tabs";
      extra.fieldValue = newTabs;
      // console.log(newTabs);
      props.onChange(dataSource.key, "", "", extra);
  }
  
  //初始化
  useEffect(() => {
    const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
    setActiveTab(checkedTab);
    if (checkedTab.type === 'category') {
      api.goods.list({'catId':checkedTab.ids,'pageNumber':1,'pageSize':8}).then((response: any)=>{
          message.destroy();
          if (response.success) {
              refreshTabGoodsList(checkedTab.key,response.data,1,response.totalCount);                
          }else{
            message.error(response?.msg);
          }
      });
    }
  }, [props.route]);

  const renderTemplate = (item: any,index: number) =>{
    document.body.style.setProperty('--selectedBgColor', dataSource.selectedBgColor);
    if (dataSource.type === 'line') {
      return <p style={{color:item.checked?dataSource.selectedColor:dataSource.color,fontSize:'14px'}}  className={item.checked?styles.plineActive:''}>{item.title}</p>;
    }
    else if (dataSource.type === 'oval') {
      const textColor = item.checked?dataSource.selectedColor:dataSource.color;
      const bgColor = item.checked?dataSource.selectedBgColor:'transparent';
      return <p style={{color:textColor,background:bgColor,fontSize:'14px'}}  className={item.checked?styles.poval:''}>{item.title}</p>;
    }
    else if (dataSource.type === 'square') {
      const textColor = item.checked?dataSource.selectedColor:dataSource.color;
      const bgColor = item.checked?dataSource.selectedBgColor:'transparent';
      return <p style={{color:textColor,background:bgColor,fontSize:'14px'}}  className={item.checked?styles.square:''}>{item.title}</p>;
    }
    return;
  }

  //标签预览内容区域
  const renderContent = () => {
    const data = dataSource?.tabs.find((item: any)=>item.checked).content;
    if (data.template === 'template1') {
      return <GoodsTemplate1 dataSource={data} />
    }
    if (data.template === 'template2') {
      return <GoodsTemplate2 dataSource={data} />
    }
    if (data.template === 'template3') {
      return <GoodsTemplate3 dataSource={data} />
    }
    if (data.template === 'template4') {
      return <GoodsTemplate4 dataSource={data} />
    }
    if (data.template === 'template5') {
      return <GoodsTemplate5 dataSource={data} />
    }
    if (data.template === 'template6') {
      return <GoodsTemplate6 dataSource={data} />
    }
    return;
  }

  //监听选项卡切换
  const onTabChange = (tab: any) => {
      //category:关联文章分类；detail:文章详情；description：文字描述；list：文章列表
      setActiveTab(tab);
      message.loading({content: '加载中',duration: 0});
      if (tab.type === 'category') {
          api.goods.list({'catId':tab.ids,'pageNumber':1,'pageSize':8}).then((response: any)=>{
              message.destroy();
              if (response.success) {
                refreshTabGoodsList(tab.key,response.data,1,response.totalCount);
              }else{
                  message.error(response?.msg);
              }
          });
      }else if (tab.type === 'list') {
          api.goods.list({'goodsKeys':tab.ids}).then((response: any)=>{
              message.destroy();
              if (response.success) {
                refreshTabGoodsList(tab.key,response.data,1,response.totalCount);
              }else{
                  message.error(response?.msg);
              }
          });
      }
  }

  //显示隐藏加载更多
  const showLoadMore = () => {
      const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
      return !(dataSource.loadMore==='manual' && checkedTab.type === 'category' && checkedTab.content.goods.length < checkedTab.totalCount);
  }

  //点击加载更多
  const onLoadMoreClick = () => {
      const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
      message.loading({content: '加载中',duration: 0});
      api.goods.list({'catId':checkedTab.ids,'pageNumber':checkedTab.pageNumber+1,'pageSize':8}).then((response: any)=>{
          message.destroy();
          if (response.success) {
              refreshTabGoodsList(checkedTab.key,response.data,checkedTab.pageNumber+1,response.totalCount);
          }else{
              message.error(response?.msg);
          }
      });
  }

  //自动翻页 --start
  const loadMore = async () =>{
      const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
      message.loading({content: '加载中',duration: 0});
      const result = api.goods.list({'catId':checkedTab.ids,'pageNumber':checkedTab.pageNumber+1,'pageSize':8});
      result.then((response: any)=>{
          message.destroy();
          if (response.success) {
            refreshTabGoodsList(checkedTab.key,response.data,checkedTab.pageNumber+1,response.totalCount);
          }else{
              message.error(response?.msg);
          }
      });
      console.log(activeTab);
      return result;
  }
  const showInfiniteScroll = () => {
      const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
      if (dataSource.loadMore==='automatic' && checkedTab.type === 'category') {
          return true
      }
      return false;
  }
  //自动翻页 --end

  return (
    <>
      <Row 
          className={styles.categoryTab}
          style = {{
            width: '100%',
            flexFlow:'row',
            // overflowX:'auto',
            // overflowY:'hidden',
            flexWrap:'nowrap',
            justifyContent:'flex-start',
            position:'relative',
            height: `${dataSource.height}px`,
            background: dataSource.bgColor,
            borderRadius: dataSource.borderRadius+'px',
            margin: common.addPx(dataSource.margin),
            padding: common.addPx(dataSource.padding),
          }}
      >
        {
          dataSource?.tabs?.map((item,index)=>{
            return (
              <Col key={item.key} span={4} className={styles.item} onClick={()=>onTabChange(item)} style={{height: `${dataSource.height}px`,}}>
                  {renderTemplate(item,index)}
              </Col>
            );
          })
        }
      </Row>

      <div style={{background: dataSource.bgColor,width:'100%'}}>
        {showInfiniteScroll()?
            <InfiniteScroll 
                style={{ fontSize: '12px' }}
                next={loadMore}
                hasMore={activeTab.content.goods.length < activeTab.totalCount}
                loader={<p style={{display:'flex',lineHeight:'45px',justifyContent:'center',color:'gray'}} hidden={!showLoadMore()}>加载中 . . .</p>} 
                dataLength={activeTab.content.goods.length}
                endMessage={<Divider plain><span style={{color:'gray'}}>已经到底了 🤐</span></Divider>}
            >
              {renderContent()}
            </InfiniteScroll>
        :renderContent()}
      </div>
      {!showInfiniteScroll()?
      <div className='load-more' hidden={showLoadMore()} onClick={onLoadMoreClick} style={{lineHeight:'70px',cursor:'pointer'}}>
          <div className='lm-wrap'><IconFont icon='icon-shuaxin' style={{marginRight:'5px',fontSize:'14px'}}/><em style={{fontSize:'13px',color:'gray'}}>加载更多</em></div>
      </div>:''}
    </>
  );

}


export default HorizontalTabs;
