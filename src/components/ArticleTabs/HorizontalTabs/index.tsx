import { 
    Row,
    Col,
    Empty,
    message,
    Divider,
 } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Common from '@/utils/Common';
import styles from "./index.less";
import "./index.less";
import IconFont from '@/components/IconFont';
import api from '@/services/api';
import { history } from 'umi';
import InfiniteScroll from 'react-infinite-scroll-component';

// addPx
const common = new Common();

const HorizontalTabsView = (props: any) => {
    const {dataSource} = props;
    const [activeTab, setActiveTab] = useState({
        'key':'',
        'content': {
          'type': '',
          'dataId':''
        },
        'articles':[],
        'totalCount': 0
      });

    const refreshTabArticles = (tabKey: string, articles: any, pageNumber: number, totalCount: number) =>{
        const extra = {};
        const newTabs = Object.assign([], dataSource.tabs);
        newTabs.map((item: any)=>{
            if (item.key === tabKey) {
                const tmpData = [...item.articles];
                item.checked = true;
                item.totalCount = totalCount;
                item.pageNumber = pageNumber;
                if (pageNumber === 1) {
                    item.articles = articles;
                }else{
                    item.articles = tmpData.concat(articles);
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

    const refreshTabDescription = (tabKey: string, description: any) =>{
        const extra = {};
        const newTabs = Object.assign([], dataSource.tabs);
        newTabs.map((item: any)=>{
            if (item.key === tabKey) {
                const tmpData = {...item.content};
                tmpData.description = description;
                item.checked = true;
                item.content = tmpData;
            }else{
                item.checked = false;
            }
        })
        extra.fieldName = "tabs";
        extra.fieldValue = newTabs;
        // console.log(newTabs);
        props.onChange(dataSource.key, "", "", extra);
    }

    useEffect(() => {
      const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
      setActiveTab(checkedTab);
      message.loading({content: '加载中',duration: 0});
      if (checkedTab.content.type === 'category') {
        api.article.list({'categoryKey':checkedTab.content.dataId,'pageNumber':1}).then((response: any)=>{
            message.destroy();
            if (response.success) {
                refreshTabArticles(checkedTab.key,response.data,1,response.totalCount);                
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

    //监听选项卡切换
    const onTabChange = (tab: any) => {
        setActiveTab(tab);
        if (tab.content.type === 'category') {
            message.loading({content: '加载中',duration: 0});
            api.article.list({'categoryKey':tab.content.dataId,'pageNumber':1}).then((response: any)=>{
                message.destroy();
                if (response.success) {
                    refreshTabArticles(tab.key,response.data,1,response.totalCount);
                }else{
                    message.error(response?.msg);
                }
            });
        }else if (tab.content.type === 'list') {
            message.loading({content: '加载中',duration: 0});
            api.article.list({'keys':tab.content.dataId}).then((response: any)=>{
                message.destroy();
                if (response.success) {
                    refreshTabArticles(tab.key,response.data,1,response.totalCount);
                }else{
                    message.error(response?.msg);
                }
            });
        }else if (tab.content.type === 'detail') {
            message.loading({content: '加载中',duration: 0});
            api.article.detail({'key':tab.content.dataId}).then((response: any)=>{
                message.destroy();
                if (response.success) {
                    refreshTabDescription(tab.key,response.data.description);                
                }else{
                    message.error(response?.msg);
                }
            });
        }else if (tab.content.type === 'description') {
            message.destroy();
            refreshTabDescription(tab.key,tab.content.description);
        }
    }

    //渲染选项卡内容
    const renderContent = () => {
        let content = <></>;
        const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
        if (checkedTab.content.type === 'category' || checkedTab.content.type === 'list') {
            content = checkedTab.articles.map((item: any)=>{
                return <Row key={item.key} style={{
                            flexFlow:'row',
                            height:'130px',
                            padding: '15px',
                            borderBottom:'1px solid #f0f0f0'
                        }} onClick={()=>{history.push('/article/detail/' + item.key,{'window':{'title':item.title}});}}>
                            <Col span={19} style={{flexFlow:'column',color:'#000',fontWeight:'500',marginRight:'5px'}}>
                                <p className='artilce-title' style={{fontSize:'18px'}}>{item.title}</p>
                                <em style={{position:'absolute',bottom:0,color:'#b5b5b5',fontSize:'12px'}}>{item.createDate}</em>
                            </Col>
                            <Col span={5}>
                                <img style={{width:'100%',height:'100%'}} src={item.image}/>
                            </Col>
                        </Row>
            });
        }else if (checkedTab.content.type === 'detail' || checkedTab.content.type === 'description') {
            content = <div dangerouslySetInnerHTML={{ __html: checkedTab.content.description }} style={{ padding: '20px',fontSize:'16px' }} />;
        }
        return content;
    }

    //显示隐藏加载更多
    const showLoadMore = () => {
        const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
        return !(dataSource.loadMore==='manual' && checkedTab.content.type === 'category' && checkedTab.articles.length < checkedTab.totalCount);
    }

    //点击加载更多
    const onLoadMoreClick = () => {
        const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
        message.loading({content: '加载中',duration: 0});
        api.article.list({'categoryKey':checkedTab.content.dataId,'pageNumber':checkedTab.pageNumber+1}).then((response: any)=>{
            message.destroy();
            if (response.success) {
                refreshTabArticles(checkedTab.key,response.data,checkedTab.pageNumber+1,response.totalCount);
            }else{
                message.error(response?.msg);
            }
        });
    }

    //自动翻页 --start
    const loadMore = async () =>{
        const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
        message.loading({content: '加载中',duration: 0});
        const result = api.article.list({'categoryKey':checkedTab.content.dataId,'pageNumber':checkedTab.pageNumber+1});
        result.then((response: any)=>{
            message.destroy();
            if (response.success) {
                refreshTabArticles(checkedTab.key,response.data,checkedTab.pageNumber+1,response.totalCount);
            }else{
                message.error(response?.msg);
            }
        });
        return result;
    }
    const showInfiniteScroll = () => {
        const checkedTab = dataSource?.tabs.find((item: any)=>item.checked);
        if (dataSource.loadMore==='automatic' && checkedTab.content.type === 'category') {
            return true;
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
            {dataSource?.tabs?.map((item: any,index: number)=>{
                return (
                    <Col key={item.key} span={4} className={styles.item} onClick={()=>onTabChange(item)} style={{height: `${dataSource.height}px`,}}>
                        {renderTemplate(item,index)}
                    </Col>
                );
            })}
        </Row>
        <div style={{display:'flex',flexFlow:'column',background:'#fff',width:'100%'}}>
            {showInfiniteScroll()?
                <InfiniteScroll 
                    style={{ fontSize: '12px' }}
                    next={loadMore}
                    hasMore={activeTab.articles.length < activeTab.totalCount}
                    loader={<p style={{display:'flex',lineHeight:'45px',justifyContent:'center',color:'gray'}} hidden={!showLoadMore()}>加载中 . . .</p>} 
                    dataLength={activeTab.articles.length}
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
        {showInfiniteScroll()}
        </>
    )
}

export default HorizontalTabsView;