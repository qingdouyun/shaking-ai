import React, { Component } from 'react';
import BackTop from '@/components/BackTop';

const Footer = (props: any) => {
  const { dataSource } = props;

  // const marginArray = dataSource.header.margin.split(",");
  // const paddingArray = dataSource.header.padding.split(",");
  // let marginStr = '';
  // let paddingStr = '';
  // marginArray.map((item: any) => {
  //   marginStr += ' ' + item + 'px';
  // });
  // paddingArray.map((item: any) => {
  //   paddingStr += ' ' + item + 'px';
  // });

  return (
    <>
    <footer>
      <div className='footer-wrapper'>
        <div className='page-width' style={{maxWidth:'1100px'}}>
          <div className='footer-content' style={{maxWidth:'1100px'}}>
            <ul className="company-info" style={{fontSize:'13px',height:'160px'}}>
              <li>
                <img src="https://cdn.shakingcloud.com/qrcode/qrcode_gzh.jpg" alt="" style={{width:'105px',height:'105px'}} />
                <div className="f-i-text"><h3 style={{fontSize:'14px'}}>关注公众号</h3><p>免费获取赚钱方案</p></div>
              </li>
              <li style={{flexFlow:'column'}}><h3 style={{fontSize:'14px'}}>联系电话</h3><p>180-0884-9500</p><p>工作日 09:00-22:00</p></li>
              <li>
                <img src="http://cdn.shakingcloud.com/qrcode/wxewm.jpg" alt="轻抖云负责人的微信" style={{width:'95px',height:'95px'}}/>
                <div className="f-i-text"><h3 style={{fontSize:'14px'}}>在线客服</h3><p>扫码添加客服微信</p><p>享受一对一服务</p></div>
              </li>
              <li style={{flexFlow:'column'}}><h3 style={{fontSize:'14px'}}>公司地址</h3><p>中国·云南</p><p>云南自由贸易试验区昆明片区经开区经开路3号</p></li>
            </ul>
          </div>
        </div>
        
        <div className='footer-copy'>
          <div className="copyright" style={{fontSize:'12px'}}>Copyright © 2022 轻抖云. Powered by shakingcloud.com   ICP许可证：滇ICP备2021000820号-1   网络违法犯罪举报网站</div>
        </div>
      </div>
    </footer>

    {/* 回到顶部 */}
    <BackTop />
    </>
  );
}


export default Footer;
