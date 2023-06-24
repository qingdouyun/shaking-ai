import React, { Component } from 'react';
import Styles from './Notice.less';
import { Alert } from 'antd';
import { history } from 'umi';
import Marquee from 'react-fast-marquee';

class Notice extends Component {

  render() {
    const { dataSource } = this.props;

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

    return (
      <>
      <div
        className={Styles.noticeContent}
        style={{
          background:dataSource.bgColor,
          margin: marginStr,
          padding: paddingStr,
          borderRadius: `${dataSource.borderRadius}px`,
          width:'100%',
          height:'45px'
        }}
        onClick={() =>
          history.push('/notice/list',{'window':{'title':'公告'}})
        }
      >
        <img style={{width:'20px', height:'20px', display:'block'}} src={dataSource.icon} alt='' />
        <div className={Styles.notice}>
          <Marquee pauseOnHover gradient={false}>
            <p style={{margin:'0',color:dataSource.fontColor,lineHeight:'28px',fontSize:'14px'}}>{dataSource.content}</p>
          </Marquee>
        </div>
      </div>
    </>
    );
  }
}


export default Notice;
