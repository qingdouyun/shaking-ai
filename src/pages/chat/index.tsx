/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import styles from "@/styles/basic.module.less";
import chatStyle from "./chat.module.less";
import { useMobileScreen } from "@/utils/ChatUtils";
import { useLocation } from "@umijs/max";
import IconFont from "@/components/IconFont";
import { SelectOutlined, SendOutlined, SettingFilled } from "@ant-design/icons";
import IconButton from "@/components/IconButton";
import BaseUtils from "@/utils/BaseUtils";
import { Alert, Avatar, Button, Form, Input, message, Modal, Select } from "antd";
import Cookies from "js-cookie";
import { history } from "@umijs/max";
import configs from "@/constants/configs";
import api from "@/services/api";
import Markdown from "@/components/Markdown";


function useScrollToBottom() {
  // for auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    const dom = scrollRef.current;
    if (dom) {
      setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  };

  // auto scroll
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    autoScroll && scrollToBottom();
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollToBottom,
  };
}

const appInfo = JSON.parse(localStorage.getItem('appInfo'));
const msgObj = {
  'avatar': appInfo.logo,
  'content':
    `Hi，我是${appInfo.name}人工智能机器人，您可以跟我讨论任何问题，但禁止发布任何违反我们大中国法律法规和相关政策的行为及内容，违者将封禁账号。`,
  'type': 'system',
  'isRequiredSubmit': false
}
let activeMsgs: React.SetStateAction<any[]> = [];

const ChatPage = () =>{
  const token = Cookies.get('token');
  const appToken = Cookies.get('appToken');
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [chatStore, setChatStore] = useState(JSON.parse(localStorage.getItem("chatStore")));//聊天信息

  const isMobileScreen = useMobileScreen();
  const location = useLocation();
  const autoFocus = !isMobileScreen; // only focus in chat page
  const [hitBottom, setHitBottom] = useState(true);
  const { scrollRef, setAutoScroll, scrollToBottom } = useScrollToBottom();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [activePrompt, setActivePrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [closed, setClosed] = useState(false);
  const [msgs, setMsgs] = useState(activeMsgs);
  const [data, setData] = useState({
    'key': '',
    'aiProductKey': chatStore.aiProductKey,
    'msgs': []
  });

  // 用于缓存socket客户端实例
  const socketClientRef = useRef<WebSocket | null>(null);
  let activeMsg = "";
  const[activeReReply, setActiveReply] = useState('');
  const messagesEndRef = useRef(null);

  //更新消息
  const updateMsgs = (param: any) => {
    if (!BaseUtils.isEmpty(param.content)) {
      if (activeMsg === 'loading') {
        activeMsg = '';
      }
      activeMsg = activeMsg + param.content;
      // activeMsg = activeMsg.replace(/\n/g, "<br />");
      setActiveReply(activeMsg);//测试
    }
  };

  //更新消息缓存
  const updateChatStoreMsgs = (msgs: []) => {
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    const tmpSessions = [...tmpStore.sessions];
    tmpSessions.map((item: any) => {
      if (item.selected) {
        item.msgs = msgs;
      }
      return '';
    });
    const tmpData = {...tmpStore};
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
  }

  //获取当前会话的AI模型
  const getCurrentChatAIModel = () => {
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    const tmpSessions = [...tmpStore.sessions];
    let aiModel = JSON.parse(localStorage.getItem(configs.aiModelStoreKey));//默认取全局配置
    tmpSessions.map((item: any) => {
      if (item.selected) {
        aiModel = item.model;
      }
      return aiModel;
    });
    return aiModel;
  }

  //心跳检测
  const heartCheck = {
    timeout: 10000, //每隔10秒发送心跳
    num: 5, //5次心跳均未响应重连
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function(){
      let _num = this.num;
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(function(){
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        socketClientRef?.current?.send("ping"); // 心跳包
        _num--;
        //计算答复的超时次数
        if(_num === 0) {
          socketClientRef?.current?.close();
        }
      }, this.timeout);
    }
  }

  //创建websocket
  const createWebSocket = () => {
    if (BaseUtils.isEmpty(token)) {
      history.push('/login');
      return;
    }
    //实现化WebSocket对象
    //指定要连接的服务器地址与端口建立连接
    //注意ws、wss使用不同的端口。我使用自签名的证书测试
    //ws对应http、wss对应https。
    // const socket = new WebSocket('ws://127.0.0.1/ai/ws/chat?appId=' + configs.APPID + `&appToken=${appToken ? appToken : ''}`, token);
    const socket = new WebSocket(appInfo.websocket+'/ai/ws/chat?appId=' + configs.APPID + `&appToken=${appToken ? appToken : ''}&chatKey=${chatStore.defaultChatKey}&aiProductKey=${chatStore.aiProductKey}`, token);
    socketClientRef.current = socket;
    //连接打开事件
    socketClientRef.current.onopen = function () {
      console.log('Socket 已打开');
      setClosed(false);
      message.destroy();
      //心跳开始（重置）
      heartCheck.start();
    };
    //连接关闭事件
    socketClientRef.current.onclose = function () {
      console.log('Socket已关闭');
      setClosed(true);
      reconnect();
    };
    //发生了错误事件
    socketClientRef.current.onerror = function () {
      message.error('服务异常: 登录已过期，请重新登录！');
      // history.push('/login');
      reconnect();
    };
    //收到消息事件
    socketClientRef.current.onmessage = function (e) {
      // console.log(e);
      if (e.data === '[DONE]') {
        activeMsgs.push({
          'avatar': appInfo.logo,
          'content':activeMsg,
          'type': 'assistant',
          'isRequiredSubmit': false
        });
        // console.log(activeMsgs);
        setMsgs(activeMsgs);
        activeMsg = "";
        setActiveReply(activeMsg);
        setSubmitting(false);
        setActivePrompt('');
        updateChatStoreMsgs(activeMsgs);
        return;
      }
      //心跳判断
      if (BaseUtils.isJSON(e.data)) {
        const resData = JSON.parse(e.data);
        if (resData.code === 'pong') {
          console.log('pong');
          //心跳开始（重置）
          heartCheck.start();
          return;
        }
      }
      message.destroy();
      setActivePrompt('');
      if (BaseUtils.isJSON(e.data)) {
        const resData = JSON.parse(e.data);
        if (resData.code === 'Forbidden' || resData.code === 'DONE') {
          activeMsgs.push({
            'avatar': appInfo.logo,
            'content': resData.content,
            'type': 'assistant',
            'isRequiredSubmit': false
          });
          setMsgs(activeMsgs);
          activeMsg = "";
          setActiveReply(activeMsg);
          setSubmitting(false);
          setActivePrompt('');
          updateChatStoreMsgs(activeMsgs);
          return;
        }
        updateMsgs(resData);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'});
    };
  }

  //重连
  let lockReconnect = false;//避免重复连接
  const reconnect = () => {
    if(lockReconnect) {
      return;
    };
    lockReconnect = true;
    const tt = setTimeout(function () {
      createWebSocket();
      lockReconnect = false;
    }, 5000);
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
  }

  
  //监听输入内容变化
  const onPromptChange = (e: any) => {
    setActivePrompt(e.target.value);
  };

  //提交对话
  const onSubmitChange = () => {
    if (BaseUtils.isEmpty(userInfo.mobile)) {
      // Dialog.show({
      //   content: '根据国家相关法律法规，'+appInfo.name+'需绑定手机号才能继续使用。',
      //   closeOnAction: true,
      //   actions: [
      //     {
      //       key: 'bindmobile',
      //       text: '绑定手机号',
      //       onClick: () => {
      //         history.push('/user/account/bind');
      //       },
      //     }
      //   ],
      // });
      return;
    }
    if (closed) {
      message.error('网络对话连接已关闭，请刷新页面重试连接');
      return;
    }
    if (activePrompt.length > 1200) {
      message.error('抱歉，您提交的内容必须控制在1200个字符以内');
      return;
    }
    if (BaseUtils.isEmpty(activePrompt)) {
      message.error('请输入您的提示');
      return;
    }

    const aiModel = getCurrentChatAIModel();
    //我的提问
    const prompt = {
      'avatar': BaseUtils.isEmpty(token)
        ? appInfo.logo
        : userInfo.avatar,
      'content': activePrompt,
      'type': 'user',
      'aiModel': aiModel.code,
      'isRequiredSubmit': false
    };
    activeMsgs.push(prompt);
    activeMsg = 'loading';
    setActiveReply(activeMsg);
    setMsgs(activeMsgs);
    updateChatStoreMsgs(activeMsgs);
    setActivePrompt('');

    const contexts: any[] = [];
    msgs.map((item: any,index: number) => {
      if (item.isRequiredSubmit || (index+1>=msgs.length-20 && item.type==='user')) {
        item.aiModel = aiModel.code;//需要将当前使用的模型提交给后台
        contexts.push(item);
      }
    });
    // context = encodeURIComponent(context);//编码处理
    setSubmitting(true);
    // console.log(contexts);
    // message.loading({
    //   duration: 0,
    //   content: '正在思考',
    // });
    socketClientRef.current?.send(JSON.stringify(contexts));//消息推送

  };

  //回车键监听
  const onKeyupChange = (e: any) => {
    if(e.ctrlKey && e.keyCode === 13) {
      if (BaseUtils.isEmpty(userInfo.mobile)) {
        // Dialog.show({
        //   content: '根据国家相关法律法规，'+appInfo.name+'需绑定手机号才能继续使用。',
        //   closeOnAction: true,
        //   actions: [
        //     {
        //       key: 'bindmobile',
        //       text: '绑定手机号',
        //       onClick: () => {
        //         history.push('/user/account/bind');
        //       },
        //     }
        //   ],
        // });
        return;
      }
      onSubmitChange();
    }
  }

  const beforeunload = (e) =>{
    let confirmationMessage = '你确定离开此页面吗?';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
  useEffect(()=>{
      return ()=>{
          window.removeEventListener("beforeunload", beforeunload) 
          // 这里写离开页面的后续操作
          // 项目中这个页面使用了websocket。所以在页面离开的时候，需要将websocket关闭掉
          // 关闭websocket
          socketClientRef.current?.close();
          // activeMsgs = [];
          activeMsg = '';
      }
  },[]);
  useEffect(()=>{
      // 拦截判断是否离开当前页面
      window.addEventListener('beforeunload', beforeunload);
  },[]);

  //清空对话
  const clearMsgs = () => {
    // Dialog.confirm({
    //   content: '确定清空所有对话记录吗？操作不可逆',
    //   onConfirm: async () => {
    //     Toast.show({
    //       icon: 'loading',
    //       content: '正在清理',
    //       duration: 0,
    //     });
    //     api.ai.clearMsgs({'key': dataKey}).then((response: any) => {
    //       if (response.success) {
    //         Toast.show({
    //           icon: 'success',
    //           content: response.msg,
    //         });
    //         setMsgs([activeMsgs[0]]);
    //       } else {
    //         Toast.show({
    //           icon: 'fail',
    //           content: response.msg,
    //         });
    //       }
    //     });
    //   },
    // });
  }

  //监听滚动
  const onChatBodyScroll = (e: HTMLElement) => {
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 100;
    setHitBottom(isTouchBottom);
  };

  const onInput = (text: string) => {
    // setUserInput(text);
    // const n = text.trim().length;

    // // clear search results
    // if (n === 0) {
    //   setPromptHints([]);
    // } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
    //   // check if need to trigger auto completion
    //   if (text.startsWith("/")) {
    //     let searchText = text.slice(1);
    //     onSearch(searchText);
    //   }
    // }
  };

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput
    // if (e.key === "ArrowUp" && userInput.length <= 0) {
    //   setUserInput(beforeInput);
    //   e.preventDefault();
    //   return;
    // }
    // if (shouldSubmit(e)) {
    //   onUserSubmit();
    //   e.preventDefault();
    // }
  };

  useEffect(() => {
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    if (!BaseUtils.isEmpty(tmpStore)) {
      tmpStore.sessions.map((item: any) => {
        if (item.key === location?.state?.chatKey) {
          const tmpMsgs = item.msgs;
          tmpMsgs.unshift(msgObj);
          setMsgs(tmpMsgs);
          activeMsgs = tmpMsgs;
        }
      });
    }
    activeMsg = '';
  }, [location?.state?.chatKey]);

  useEffect(()=>{
    //activeMsgs.push(msgObj);//重置下
    createWebSocket();
    // message.loading({
    //   duration: 0,
    //   content: '正在连接',
    // });
    // api.ai.chatDetail({'key': dataKey}).then((response: any) => {
    //   if (response.success) {
    //     setData(response.data);
    //     if (!BaseUtils.isEmpty(response.data.msgs)) {
    //       let tmpMsgs = [...msgs];
    //       if (!BaseUtils.isEmpty(response.data?.product?.description)) {
    //         tmpMsgs.push({
    //           'avatar': appInfo.logo,
    //           'content': response.data?.product?.description,
    //           'type': 'assistant'
    //         });
    //       }
    //       tmpMsgs = tmpMsgs.concat(response.data.msgs);
    //       setMsgs(tmpMsgs);
    //       activeMsgs = tmpMsgs;
    //     }
    //     createWebSocket();
    //   } else {
    //     message.error({
    //       icon: 'fail',
    //       content: response.msg,
    //     });
    //   }
    // });
  },[]);

  //设置 ---start
  const [visible,setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(()=>{
    const aiModel = getCurrentChatAIModel();
    form.setFieldsValue({
      'aiModel': aiModel.code
    });
  },[]);

  //提交
  const submitSetting = async () => {
    const values = await form.validateFields();
    const tmpStore = JSON.parse(localStorage.getItem("chatStore"));
    const tmpSessions = [...tmpStore.sessions];
    tmpSessions.map((item: any) => {
      if (item.selected) {
        item.model.code = values.aiModel;
      }
      return '';
    });
    const tmpData = {...tmpStore};
    tmpData.sessions = tmpSessions;
    setChatStore(tmpData);
    localStorage.setItem('chatStore', JSON.stringify(tmpData));
    
    setVisible(false);
  }
  //设置 ---End

  //停止
  const stopPrint = () => {
    socketClientRef.current?.send(configs.aiStopPrint);//消息推送
  }

  return (
    <>
    <div className={styles.chat} key={'aiChat'}>
      <div
        className={styles["chat-body"]}
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onMouseDown={() => inputRef.current?.blur()}
        onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {msgs.map((item: any, index: number) => {
          if (item.type === 'assistant' || item.type === 'system') {
            return <div
                      key={item.key}
                      className={styles["chat-message"]}
                    >
                      <div className={styles["chat-message-container"]}>
                        <div className={styles["chat-message-avatar"]}>
                          <Avatar src={appInfo.logo} />
                        </div>
                        <div className={styles["chat-message-item"]} style={{marginLeft:'10px'}}>
                          <div className={styles["chat-message-top-actions"]}>
                              {/* <div
                                className={styles["chat-message-top-action"]}
                                onClick={() => {stopPrint()}}
                              >
                                停止
                              </div> */}
                            {/* {message.streaming ? (
                              
                            ) : (
                              <>
                                <div
                                  className={styles["chat-message-top-action"]}
                                  onClick={() => onDelete(message.id ?? i)}
                                >
                                  删除
                                </div>
                                <div
                                  className={styles["chat-message-top-action"]}
                                  onClick={() => onResend(message.id ?? i)}
                                >
                                  重试
                                </div>
                              </>
                            )}

                            <div
                              className={styles["chat-message-top-action"]}
                              onClick={() => copyToClipboard(message.content)}
                            >
                              复制
                            </div> */}
                          </div>
                          <div style={{lineHeight:'1.5'}}>
                            {/* <p dangerouslySetInnerHTML={{ __html: item.content }} style={{WebkitUserSelect:'auto'}}/> */}
                            <Markdown
                              content={item.content}
                              loading={false}
                              // onContextMenu={(e) => onRightClick(e, message)}
                              // onDoubleClickCapture={() => {
                              //   if (!isMobileScreen) return;
                              //   setUserInput(item.content);
                              // }}
                              fontSize={14}
                              parentRef={scrollRef}
                              defaultShow={true}
                            />
                          </div>
                          {/* <div className={styles["chat-message-actions"]}>
                            <div className={styles["chat-message-action-date"]}>
                              {item.createDate}
                            </div>
                          </div> */}
                        </div>
                        
                      </div>
                    </div>
          } else if (item.type === 'user') {
            return <div
                      key={item.key}
                      className={styles["chat-message-user"]}
                    >
                      <div className={styles["chat-message-container"]}>
                        <div className={styles["chat-message-item"]} style={{marginRight:'10px'}}>
                          <div style={{lineHeight:'1.5'}}>
                            <p dangerouslySetInnerHTML={{ __html: item.content }} style={{WebkitUserSelect:'auto'}}/>
                          </div>
                        </div>
                        <div className={styles["chat-message-avatar"]}>
                          <Avatar src={BaseUtils.isEmpty(token)
                              ? appInfo.logo
                              : userInfo.avatar} />
                        </div>
                      </div>
                    </div>
          }
          return <></>;
        })}
        <div key='activeReplyMsg' className={styles["chat-message"]} hidden={activeReReply===''}>
          <div className={styles["chat-message-container"]}>
            <div className={styles["chat-message-avatar"]}>
              <Avatar src={appInfo.logo} />
            </div>
            <div className={styles["chat-message-item"]} style={{marginLeft:'10px'}}>
              <div className={styles["chat-message-top-actions"]}>
                  <div
                    className={styles["chat-message-top-action"]}
                    onClick={() => {stopPrint()}}
                  >
                    停止
                  </div>
              </div>
              <div style={{lineHeight:'1.5'}}>
                <div className="loading-wrapper" hidden={activeReReply!=='loading'}>
                  <div className="loading-dot1" />
                  <div className="loading-dot2" />
                  <div className="loading-dot3" />
                </div>
                {/* <p hidden={activeReReply==='loading'} dangerouslySetInnerHTML={{ __html: activeReReply }} style={{WebkitUserSelect:'auto'}}/> */}
                <div hidden={activeReReply==='loading'}>
                  <Markdown
                    content={activeReReply}
                    loading={false}
                    // onContextMenu={(e) => onRightClick(e, message)}
                    // onDoubleClickCapture={() => {
                    //   if (!isMobileScreen) return;
                    //   setUserInput(item.content);
                    // }}
                    fontSize={14}
                    parentRef={scrollRef}
                    defaultShow={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} style={{width:'100%',height:'1px'}} />
        
      </div>

      <div className={styles["chat-input-panel"]}>
        <div className={chatStyle["chat-input-actions"]}>
          <div className={`${chatStyle["chat-input-action"]} clickable`} onClick={() => {setVisible(true)}}>
            <SettingFilled />&nbsp;版本切换
          </div>
      </div>
        <div className={styles["chat-input-panel-inner"]}>
          <textarea
            ref={inputRef}
            className={styles["chat-input"]}
            placeholder={'Ctrl + Enter 发送 / 请在这里输入您的提示！'}
            // onInput={(e) => onInput(e.currentTarget.value)}
            onChange={onPromptChange}
            value={activePrompt}
            onKeyUp={onKeyupChange}
            onKeyDown={onInputKeyDown}
            onFocus={() => setAutoScroll(true)}
            onBlur={() => setAutoScroll(false)}
            rows={4}
            autoFocus={autoFocus}
          />
          <Button
            icon={<SendOutlined />}
            className={styles["chat-input-send"]}
            type="primary"
            loading={submitting}
            onClick={onSubmitChange}
            style={{position:'absolute'}}
          >确认发送</Button>
        </div>
      </div>
    </div>
    {/* 设置弹框 */}
    <Modal
      title='当前会话设置'
      visible={visible}
      closable={true}
      onCancel={() => {setVisible(false);}}
      width={520}
      style={{top:'35%'}}
      bodyStyle={{}}
      footer={[
        <Button key="back" onClick={()=>{setVisible(false)}}>
          取消
        </Button>,
        <Button key='confirmsetting' type="primary" onClick={submitSetting}>
          切换
        </Button>,
      ]}
    >
      <Alert type='warning' closable showIcon message='您当前正在执行AI模型切换操作，请注意GPT-4模型将会消耗大量的Token，大概为GPT-3.5的15~60倍，且速度相对较慢，请谨慎使用，是否继续？' style={{marginBottom:'15px'}}/>
      <Form
        layout="horizontal"
        form={form}
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}
        initialValues={{}}
      >
        <Form.Item hidden name='key'><Input /></Form.Item>
        <Form.Item
          name="aiModel"
          rules={[{ required: true, message: '请选择模型' }]}
          label="AI模型"
        >
          <Select style={{ width: "100%" }} placeholder="请选择">
            <Select.Option key="OPENAI_GPT35" value='OPENAI_GPT35'>GPT-3.5模型</Select.Option>
            <Select.Option key="OPENAI_GPT4" value='OPENAI_GPT4'>GPT-4.0模型</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
}

export default ChatPage;