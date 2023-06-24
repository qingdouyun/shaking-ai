/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/basic.module.less";
import { history } from "@umijs/max";
import IconButton from "../IconButton";
import IconFont from "../IconFont";
import { Link } from "@umijs/max";
import BaseUtils from "@/utils/BaseUtils";
import StringUtils from "@/utils/StringUtils";
import api from "@/services/api";
import { Button, Image, message, Modal, Popover, Space } from "antd";
import moment from "moment";
import { CustomerServiceOutlined, EditOutlined, MobileOutlined, PictureOutlined, PlusOutlined, QrcodeOutlined, WechatOutlined } from "@ant-design/icons";
import { useLocation } from "@umijs/max";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ProTable } from "@ant-design/pro-components";
import QRCode from "qrcode.react";
import configs from "@/constants/configs";

const SideBar = (props: any) => {
  const location = useLocation();
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息
  const [chatStore, setChatStore] = useState(JSON.parse(localStorage.getItem("chatStore")));//聊天信息


  useEffect(() => {
    if (BaseUtils.isEmpty(appInfo) || appInfo?.expired < Date.now()) {
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
    if (BaseUtils.isEmpty(chatStore)) {
      const initChatStore = {
        'aiProductKey': configs.defaultAiProductKey,//写死为万能对话产品
        'defaultChatKey': '',//先写死为默认会话
        'sessions': [
          {
            'key': `sk-${StringUtils.generateId(9)}`,
            'title': '新的会话',
            'createDate': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            'selected': false,
            'model': configs.AIModel,
            'type':'text',//语言文本：image代表图片
            'msgs': []
          }
        ]
      }
      setChatStore(initChatStore);
      localStorage.setItem('chatStore', JSON.stringify(initChatStore));
    }
  }, []);

  //同步更新标题
  useEffect(()=>{
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    setChatStore(tmpStore);
  },[location?.state?.window?.title]);


  //监听会话切换
  const onChatChange = (param: any) => {
    if (!BaseUtils.isLogin()) {
      return;
    }
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    const tmpSessions = [...tmpStore.sessions];
    tmpSessions.map((item: any) => {
      if (item.key === param.key) {
        item.selected = true;
      }else {
        item.selected = false;
      }
    });
    const tmpData = {...tmpStore};
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
    if (param.type === 'text') {
      history.push('/chat',{'chatKey':param.key,'window':{'title': param.title,'subtitle':`与${appInfo.name}的${param.msgs.length}条对话`}});
    }else if (param.type === 'image') {
      history.push('/chat/imager',{'chatKey':param.key,'window':{'title': param.title,'subtitle':`与${appInfo.name}的${param.msgs.length}条对话`}});
    }
  }

  //新开聊天会话
  const createChat = (param: any) => {
    if (!BaseUtils.isLogin()) {
      return;
    }
    // console.log(param);
    const newChat = {
      'key': `sk-${StringUtils.generateId(9)}`,
      'title': '新的会话',
      'createDate': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'selected': false,
      'model': configs.AIModel,
      'type':'text',//语言文本：image代表图片
      'msgs': []
    };
    if (!BaseUtils.isEmpty(param.key) && !BaseUtils.isEmpty(param.context)) {
      newChat.title = param.name;
      param.context.map((item: any) => {
        newChat.msgs.push({
          'avatar': appInfo.logo,
          'content': item.content,
          'type': item.type,
          'isRequiredSubmit': true
        });
      });
    }
    const tmpSessions = [...chatStore.sessions];
    tmpSessions.unshift(newChat);
    tmpSessions.map((item: any) => {
      if (item.key === newChat.key) {
        item.selected = true;
      }else {
        item.selected = false;
      }
    });
    const tmpData = {...chatStore};
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
    history.push('/chat',{'chatKey':newChat.key,'window':{'title': newChat.title,'subtitle':`与${appInfo.name}的${newChat.msgs.length}条对话`}});
    setVisible(false);
  }

  //新开生成图片会话
  const createImageChat = (param: any) => {
    if (!BaseUtils.isLogin()) {
      return;
    }
    const tmpData = {...chatStore};
    //默认图片会话
    if (BaseUtils.isEmpty(tmpData?.defaultImageChatKey)) {
      api.ai.defaultChat({'aiProductKey': configs.defaultAiProductKey,'type':'image'}).then((response)=>{
        message.destroy();
        if (response.success) {
          tmpData.defaultImageChatKey = response.data.key;
          localStorage.setItem('chatStore', JSON.stringify(tmpData));
        } else {
          message.error(response.msg);
        }
      });
    }
    // console.log(param);
    const newChat = {
      'key': `sk-${StringUtils.generateId(9)}`,
      'title': '新的生成图片会话',
      'createDate': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'selected': false,
      'model': configs.AIImageModel,
      'type':'image',//语言文本：image代表图片
      'msgs': []
    };
    if (!BaseUtils.isEmpty(param.key) && !BaseUtils.isEmpty(param.context)) {
      newChat.title = param.name;
      param.context.map((item: any) => {
        newChat.msgs.push({
          'avatar': appInfo.logo,
          'content': item.content,
          'type': item.type,
          'isRequiredSubmit': true
        });
      });
    }
    const tmpSessions = [...chatStore.sessions];
    tmpSessions.unshift(newChat);
    tmpSessions.map((item: any) => {
      if (item.key === newChat.key) {
        item.selected = true;
      }else {
        item.selected = false;
      }
    });
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
    history.push('/chat/imager',{'chatKey':newChat.key,'window':{'title': newChat.title,'subtitle':`与${appInfo.name}的${newChat.msgs.length}条对话`}});
    setVisible(false);
  }

  //删除会话
  const deleteChat = (param: any) => {
    if (!BaseUtils.isLogin()) {
      return;
    }
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    if (tmpStore.sessions.length === 1) {
      message.error('至少存留一个会话');
      return;
    }
    const tmpSessions: any[] = [];
    let tmpChat = {
      'key':'',
      'title':'',
      'model': configs.AIModel,
      'type':'text',//语言文本：image代表图片
      'msgs':[]
    };
    tmpStore.sessions.map((item: any,index: number) => {
      if (item.key !== param.key) {
        tmpSessions.push(item);
      }
    });
    tmpSessions.map((item: any,index: number) => {
      if (index === 0) {
        tmpChat = item;
        item.selected = true;
      }else {
        item.selected = false;
      }
    });
    const tmpData = {...tmpStore};
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
    history.push('/chat',{'chatKey':tmpChat.key,'window':{'title': tmpChat.title,'subtitle':`与${appInfo.name}的${tmpChat.msgs.length}条对话`}});
  }

  //拖拽排序
  /**
   * 重新排序
   * @param {*} list 列表数据
   * @param {*} originalIndex 当前所在的index位置
   * @param {*} targetIndex 目标index位置
   */
  const reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    originalIndex: number,
    targetIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(originalIndex, 1);
    result.splice(targetIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    const tmpSessions = [...tmpStore.sessions];
    // 代表在同一 Droppable 区域下拖拽
    const items = reorder(tmpSessions, source.index, destination.index);
    const tmpData = {...tmpStore};
    tmpData.sessions = items;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
  };

  const onDelete = (index: number) => {
    // const images = [...dataSource];
    // images.splice(index, 1);
    
  };

  //预设对话 ---start
  const tableRef = useRef();
  // 函数组件中定义一个状态变量
  const [visible, setVisible] = useState(false);
  const [paginationProps, setPaginationProps] = useState({
    showSizeChanger: true,
    showQuickJumper: false,
    pageSize: 10,
    total: 1,
  });

  const getPresetList = (param, sort, filter) => {
    const params = {
      pageNumber: param.current,
      pageSize: param.pageSize,
    };
    const result = api.ai.preset.list(params);
    result.then((response) => {
      const pageProps = { ...paginationProps };
      pageProps.total = response.totalCount;
      setPaginationProps(pageProps);
    });
    return result;
  };

  const columns = [
    {
      title: "图片",
      dataIndex: "image",
      width: 80,
      key: "image",
      hideInSearch: true,
      render: (text, record) => <Image width={30} src={record.image} />,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "语言",
      dataIndex: "lang",
      width: 80,
      valueEnum: {
        'cn': { text: "中文", status: "Success" },
        'en': { text: "英文", status: "Error" },
      },
    },
    {
      title: "随机性",
      dataIndex: "temperature",
      width: 80,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      width: 100,
      render: (_, record) => (
        <>
          <a onClick={() => {createChat(record);}}>开始对话</a>
        </>
      ),
    },
  ];
  //预设对话 ---end

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
    <div
      className={`${styles.sidebar} ${props.className}`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>{appInfo?.name}</div>
        <div className={styles["sidebar-sub-title"]}>
          {appInfo?.introduction}
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <img src={appInfo?.logo} width={40} onClick={()=>{history.push('/')}}/>
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<IconFont icon='icon-shouyeh'/>}
          text={'首页'}
          className={styles["sidebar-bar-button"]}
          onClick={()=>{history.push('/',{'window':{'title':'首页'}});}}
          shadow
        />
        <IconButton
          icon={<IconFont icon='icon-wodeh'/>}
          text={'我的'}
          className={styles["sidebar-bar-button"]}
          onClick={() => {
            if (BaseUtils.isLogin()) {
              history.push('/user/profile',{'window':{'title':'个人中心'}});
            }
          }}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={() => {}}
      >
        {/* 会话列表 */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {chatStore?.sessions?.map((item: any, index: number) => (
                  <Draggable
                    key={`${index}`}
                    draggableId={`${index}`}
                    index={index}
                  >
                    {(provided: any, snapshot: any) => (
                      <div
                        key={item.key}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${styles["chat-item"]} ${
                          item.selected && styles["chat-item-selected"]
                        }`}
                        onClick={()=>{onChatChange(item)}}
                        title={`${item.title}${index+1}`}
                      >
                        <div className={styles["chat-item-title"]}>{item.title}</div>
                        <div className={styles["chat-item-info"]}>
                          <div className={styles["chat-item-count"]}>
                            {item.msgs.length}&nbsp;条对话
                          </div>
                          <div className={styles["chat-item-date"]}>
                            {item.createDate}
                          </div>
                        </div>
                        <div
                          className={styles["chat-item-delete"]}
                          onClickCapture={()=>{deleteChat(item)}}
                        >
                          <IconButton icon={<IconFont icon='icon-laji'/>} shadow />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          {/* <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<IconFont icon='icon-shuaxin'/>}
              onClick={() => {}}
            />
          </div> */}
          <div className={styles["sidebar-action"]}>
            <IconButton icon={<MobileOutlined />} shadow onClick={()=>{openQrcodeDialog('mobileSite')}}/>
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton icon={<WechatOutlined />} shadow onClick={()=>{openQrcodeDialog('wxMpQrcode')}}/>
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton icon={<IconFont icon='icon-douyin' />} shadow onClick={()=>{openQrcodeDialog('douyinQrcode')}}/>
          </div>
          {/* <div className={styles["sidebar-action"]}>
            <a href='https://www.shakingcloud.com' target="_blank" rel="noreferrer">
              <IconButton icon={<IconFont icon='icon-shuaxin'/>} shadow />
            </a>
          </div> */}
        </div>
        <div>
          <Popover content={
            <Space>
              <IconButton
                icon={<EditOutlined style={{fontSize:'18px'}}/>}
                text='普通对话'
                onClick={() => {
                  if (!BaseUtils.isLogin()) {
                    return;
                  }
                  setVisible(true);
                }}
                shadow
              />
              <IconButton
                icon={<PictureOutlined style={{fontSize:'18px'}}/>}
                text='生成图像'
                onClick={() => {
                  createImageChat({
                    'key':'msg-000',
                    'name':'新的生成图片会话',
                    'context': [{
                      'type': 'user',
                      'content': `Hi，我是${appInfo.name}人工智能机器人，这里是AI成像引擎，我会根据您输入的要求，为您生成一张精美的图案！<br/>注：生成的图片由于太大，没法缓存，若有需要，请自行保存`
                    }]
                  });
                }}
                shadow
              />
            </Space>
          } title="选择类型" trigger="click">
            <IconButton
              icon={<IconFont icon='icon-jiahao1' style={{fontSize:'18px'}}/>}
              text='新开会话'
              shadow
            />
          </Popover>
        </div>
      </div>

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

      {/* 查看预设角色 */}
      <Modal
        forceRender
        visible={visible}
        title="选择角色"
        width={800}
        style={{ top: '20%' }}
        bodyStyle={{ padding:6,height:'100%' }}
        onCancel={()=>{setVisible(false)}}
        footer={[
          <Button key='addchat' icon={<PlusOutlined />} type="primary" onClick={() => createChat({'key':''})} style={{borderRadius:'6px'}}>
            直接开始
          </Button>
        ]}
      >
        <ProTable
          actionRef={tableRef}
          pagination={paginationProps}
          toolBarRender={false}
          search={false}
          options={false}
          columns={columns}
          rowSelection={false}
          request={getPresetList}
        />
      </Modal>

    </div>
  );
}

export default SideBar;