import {history,Outlet} from "umi";
import {isMobile} from 'react-device-detect';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BaseUtils from "@/utils/BaseUtils";
import { getCSSVar, useMobileScreen } from "@/utils/ChatUtils";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button, Card, Form, Input, message, Modal } from "antd";
import styles from "@/styles/basic.module.less";
import "@/styles/markdown.less";
import "@/styles/highlight.less";
import configs from "@/constants/configs";
import SideBar from "@/components/SideBar";
import IconButton from "@/components/IconButton";
import IconFont from "@/components/IconFont";
import { useLocation } from "@umijs/max";
import { CustomerServiceOutlined, EditOutlined, LeftOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import Cookies from "js-cookie";

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const BasicLayout = () => {
    const location = useLocation();
    // console.log(location);
    const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息
    const [currentWindow, setCurrentWindow] = useState(BaseUtils.isEmpty(appInfo)?{'title':appInfo?.name}:{'title':'首页'});//窗口
    const isMobileScreen = useMobileScreen();

    if (isMobileScreen && !BaseUtils.isEmpty(appInfo)) {
      window.location.href = appInfo?.mobileDomain + location.pathname + location.search;
    }

    //默认会话加载
    const loadingDefaultChat = () => {
      const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
      const token = Cookies.get('token');
      if (BaseUtils.isEmpty(tmpStore?.defaultChatKey) && !BaseUtils.isEmpty(token)) {
        api.ai.defaultChat({'aiProductKey': configs.defaultAiProductKey}).then((response)=>{
          message.destroy();
          if (response.success) {
            tmpStore.defaultChatKey = response.data.key;
            localStorage.setItem('chatStore', JSON.stringify(tmpStore));
          } else {
            message.error(response.msg);
          }
        });
      }
    }
    
    useEffect(() => {
      if (!BaseUtils.isEmpty(location?.state?.window?.title)) {
        setCurrentWindow({'title':location?.state?.window?.title,'subtitle':location?.state?.window?.subtitle});
      }
      loadingDefaultChat();
      // console.log(location);
    }, [location.pathname]);

    //AI会话改变监听
    useEffect(() => {
      if (!BaseUtils.isEmpty(location?.state?.window?.title)) {
        setCurrentWindow({'title':location?.state?.window?.title,'subtitle':location?.state?.window?.subtitle});
      }
      
    }, [location?.state?.chatKey]);

    useEffect(() => {
        if (BaseUtils.isEmpty(appInfo) || appInfo?.expired < Date.now()) {
          // console.log(33333);
          api.app.getInfo({}).then((response: any) => {
            if (response.success) {
              response.data.expired = Date.now() + 30 * 60 * 1000;
              localStorage.setItem('appInfo', JSON.stringify(response.data));
              setAppInfo(response.data);
              if (isMobileScreen) {
                window.location.href = response.data.mobileDomain;
              }
            } else {
              message.error(response.msg);
            }
          });
        }
        const aiModel = JSON.parse(localStorage.getItem(configs.aiModelStoreKey));
        if (BaseUtils.isEmpty(aiModel)) {
          localStorage.setItem(configs.aiModelStoreKey,JSON.stringify(configs.AIModel));
        }
    }, []);

    //修改标题
    const [uform] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [submiting, setSubmiting] = useState(false);

    const onTitleChange = () => {
      if (location.pathname==='/chat') {
        setVisible(true);
        const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
        let chatKey = '';
        tmpStore.sessions.map((item: any) => {
          if (item.selected) {
            chatKey = item.key;
          }
        });
        uform.setFieldsValue({
          'key': chatKey,
          'title': currentWindow?.title
        });
      }
    }

    const onTitleSubmit = async () => {
      const values = await uform.validateFields();
      setSubmiting(true);
      const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
      const tmpSessions = [...tmpStore.sessions];
      tmpSessions.map((item: any) => {
        if (item.key === values.key) {
          item.title = values.title;
        }
      });
      const tmpData = {...tmpStore};
      tmpData.sessions = tmpSessions;
      setCurrentWindow({'title': values.title,'subtitle':location?.state?.window?.subtitle});
      localStorage.setItem('chatStore', JSON.stringify(tmpData));
      history.push('/chat',{'chatKey':values.key,'window':{'title': values.title,'subtitle': location?.state?.window?.subtitle}});
      setSubmiting(false);
      setVisible(false);
    };

    //二维码弹框 ---start
    const [activeQrcodeType, setActiveQrcodeType] = useState('mobileSite');
    const [qrcodeTitle, setQrcodeTitle] = useState('手机端H5');
    const [qrcodeUrl, setQrcodeUrl] = useState(appInfo?.mobileDomain);
    const [qrcodeVisible, setQrcodeVisible] = useState(false);

    //打开弹框
    const openQrcodeDialog = (type: string) => {
      setActiveQrcodeType(type);
      setQrcodeVisible(true);
      switch (type) {
        case 'mobileSite':
          setQrcodeTitle('手机端H5');
          setQrcodeUrl(appInfo?.mobileDomain);
          break;
        case 'wxKfQrcode':
          setQrcodeTitle('微信客服');
          setQrcodeUrl(appInfo?.wxKfQrcode);
          break;
        case 'wxMpQrcode':
          setQrcodeTitle('微信公众号');
          setQrcodeUrl(appInfo?.wxMpQrcode);
          break;
        case 'douyinQrcode':
          setQrcodeTitle('抖音号');
          setQrcodeUrl(appInfo?.douyinQrcode);
          break;
          
        default:
          break;
      }
    }
    
    //二维码弹框 ---end

    return (
      <>
      <div
        className={
          styles.container +
          ` ${
            configs.tightBorder && !isMobileScreen
              ? styles["tight-container"]
              : styles.container
          }`
        }
      >
        <SideBar className={true ? styles["sidebar-show"] : ""} />

        <div className={styles["window-content"]} id={configs.AppBodyId}>
            <div className="window-header">
              <div className="window-header-title">
                <div
                  className={`window-header-main-title ${styles["chat-body-title"]}`}
                  onClickCapture={()=>{onTitleChange()}}
                >
                  {currentWindow?.title} <EditOutlined hidden={location.pathname!=='/chat'}/>
                </div>
                <div className="window-header-sub-title">
                  {currentWindow?.subtitle}
                </div>
              </div>
              <div className="window-actions">
                {/* <div className={"window-action-button" + " " + styles.mobile}>
                  <IconButton
                    icon={<IconFont icon='icon-shuaxin'/>}
                    bordered
                    title={'按钮1'}
                    onClick={() => {}}
                  />
                </div> */}
                <div className="window-action-button" hidden={location.pathname==='/'}>
                  <IconButton
                    icon={<LeftOutlined />}
                    bordered
                    text="返回"
                    onClick={()=>{history.back();}}
                  />
                </div>
                <div className="window-action-button">
                  <IconButton
                    icon={<IconFont icon='icon-shouyeh' style={{fontSize:'18px'}}/>}
                    bordered
                    title={'首页'}
                    onClick={() => {history.push('/',{'window':{'title':'首页'}});}}
                  />
                </div>
                <div className="window-action-button">
                  <IconButton
                    icon={<CustomerServiceOutlined />}
                    bordered
                    title={'客服'}
                    onClick={() => {openQrcodeDialog('wxKfQrcode')}}
                  />
                </div>
                {/* {!isMobileScreen && (
                  <div className="window-action-button">
                    <IconButton
                      icon={configs.tightBorder ? <IconFont icon='icon-suoyou'/> : <IconFont icon='icon-wodeh'/>}
                      bordered
                      onClick={() => {}}
                    />
                  </div>
                )} */}
            </div>
          </div>
          {/* 渲染子路由 */}
          <div className={styles["window-content-wrapper"]} id="scrollableDiv">
            <div className={styles["window-content-body"]} style={location.pathname.indexOf('/chat')>-1?{margin:0}:{}}>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>

      <Modal
        forceRender
        visible={visible}
        title='编辑会话'
        width={390}
        bodyStyle={{ padding: "10px" }}
        onOk={onTitleSubmit}
        onCancel={()=>{setVisible(false)}}
        footer={[
          <Button key="back" onClick={()=>{setVisible(false)}}>
            取消
          </Button>,
          <Button key="confirm" type="primary" loading={submiting} onClick={onTitleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <Form
            {...formLayout}
            hideRequiredMark={false}
            style={{
              marginTop: 20,
            }}
            name="commonForm"
            form={uform}
          >
            <FormItem label="ID" name="key" hidden>
              <Input />
            </FormItem>
            <FormItem 
              label="会话标题" 
              name="title"
              rules={[
                {
                  required: true,
                  message: "标题必填",
                },
              ]}
            >
              <Input placeholder="请输入标题" />
            </FormItem>
          </Form>
        </Card>
      </Modal>

      {/* 二维码弹框 */}
      <Modal
        title={qrcodeTitle}
        visible={qrcodeVisible}
        closable={true}
        onCancel={() => { setQrcodeVisible(false);}}
        footer={false}
        width={360}
        style={{top:'35%'}}
        bodyStyle={{}}
      >
        <>
          <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', padding: '10px 0' }}>
            {activeQrcodeType === 'mobileSite' ? <QRCode value={qrcodeUrl} size={200} /> : <img width={200} src={qrcodeUrl}/>}
            <div style={{ display: 'flex', alignItems: 'center', width: '200px', marginTop: '12px', color: '#8a8a8a', justifyContent: 'space-between' }}>
              <img src='http://cdn.shakingcloud.com/icon/saoyisao.png' width={30} />
              <div>
                <p style={{ margin: 0 }}>
                  {activeQrcodeType.indexOf('wx')>-1 ? '请打开手机微信' : activeQrcodeType.indexOf('douyin')>-1 ?'请打开手机抖音':'请打开手机微信'}
                </p>
                <p style={{ margin: 0 }}>扫描二维码查看</p>
              </div>
            </div>
          </div>
        </>
      </Modal>
      
      </>
    )
}

export default BasicLayout;