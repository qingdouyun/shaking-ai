import React, {  useState, useEffect } from 'react';
import api from '@/services/api';
import StringUtils from '@/utils/StringUtils';
import {ButtonCom} from "@/components";
import Styles from "./index.module.less";
import Assets from '@/assets/images';
import { history } from '@umijs/max';
import ProfileEditor from './edit';
import { message, Modal } from 'antd';
import Cookies from 'js-cookie';

const ProfilePage = (props: any) => {
  
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));

  const [avatarvisible, setAvatarVisible] = useState(false);
  const [ossData, setOssData] = useState<any>({});
  const [info, setInfo] = useState({
    avatar: Assets.defaultAvatar,
    nickname: '',
    autograph: '',
    invitationCode: '',
    mobile: '',
    walletAddress: '',
  });
  const [contentType, setContentType] = useState('info');
  const [visible, setVisible] = useState(false);


  const init = async () => {
    api.getOssSign({ type: 'picture' }).then((response: any) => {
      if (response.success) {
        const tmpOssData: any = { ...ossData };
        tmpOssData.policy = response.data.policy;
        tmpOssData.signature = response.data.signature;
        tmpOssData.expire = response.data.expire;
        tmpOssData.host = response.data.host;
        tmpOssData.accessKeyId = response.data.accessKeyId;
        tmpOssData.callback = response.data.callback;
        tmpOssData.dir = response.data.dir;

        setOssData(tmpOssData);
      } else {
        message.error(response.msg);
        return;
      }
    });
  };


  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    init();
    api.user.get_info().then((res) => {
      message.destroy();
      if (res.success) {
        setInfo(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  // 上传头像确认更新
  const saveAvatar = async () => {
    if (info.avatar === '') {
      message.error('请上传头像');
      return;
    }
    api.user.update_avatar({ avatar: info.avatar }).then((res) => {
      if (res.success) {
        setInfo(info);
        setAvatarVisible(false);
        // localStorage.setItem('userInfo', JSON.stringify());
      }
    });
  };

  const mockUpload = async (file: File) => {
    // const uuId = uuid(); // 文件名
    // 提交给oss的参数
    const fkey = `${StringUtils.generateId(16)}`;
    let fmat = file.name.split('.')[1];
    if (fmat === 'jpg') {
      fmat = 'jpeg';
    }
    const key = `${ossData.dir}${fkey}.${fmat}`;
    const params = {
      name: file.name,
      key,
      OSSAccessKeyId: ossData.accessKeyId,
      policy: ossData.policy,
      Signature: ossData.signature,
      success_action_status: '200',
      file: file, // 一定在最后面
    };

    const formData = new FormData(); // 以表单的形式传递给oss
    Object.keys(params).forEach((ikey) => {
      formData.append(ikey, params[ikey]);
    });
    //请求oss上传;
    const result = await api.uploadOss(formData);
    if (result == '') {
      setInfo((state) => {
        state.avatar = `${appInfo.ossDomain}/${key}`;

        return state;
      });
    }

    return {
      url: URL.createObjectURL(file),
    };
  };

  // 限制图片数量
  // const LimitCount: FC = () => {
  //   const maxCount = 1;
  //   const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  //   return (
  //     <ImageUploader
  //       value={fileList}
  //       accept="image/jpeg,image/jpg,image/png"
  //       onChange={setFileList}
  //       upload={mockUpload}
  //       multiple
  //       maxCount={1}
  //       showUpload={fileList.length < maxCount}
  //       onCountExceed={(exceed) => {
  //         message.error(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
  //       }}
  //     />
  //   );
  // };

  const mobileStr = (mobile: string, start: number = 3, end: number = 4) => {
    if(!mobile) {
      return ''
    }
    let fillNum = mobile.length - start - end
    return mobile.substring(0, start) + ''.padStart(fillNum, '*') + mobile.substring(mobile.length - end, mobile.length)
  }

  const copyUtils = (content: any) => {
    const copy = (e: any) => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', content);
      message.success('复制成功');
      document.removeEventListener('copy', copy);
    };
    document.addEventListener('copy', copy);
    document.execCommand('Copy');
  };

  //编辑切换
  const onEditChange = (type: string) => {
    console.log(type);
    setContentType(type);
  }

  // 退出登录
  const logOut = () => {
    setVisible(false);
    message.loading({content:'请稍后',duration:0});
    api.logout().then((res) => {
      message.destroy();
      if (res.success) {
        Cookies.set('token', '');
        // localStorage.clear();
        history.push({ pathname: '/' });
        message.success(res.msg);
      }else{
        message.error(res.msg);
      }
    });
  };

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>个人资料</p></div>
      {contentType!=='info'?<ProfileEditor onChange={onEditChange}/>:''}
      <div className={Styles.personalinfo} hidden={contentType !== 'info'}>
        <img
          onClick={() => {
            //setAvatarVisible(true);
          }}
          src={info.avatar}
          className={Styles.avatar}
        />

        <div
          className={Styles.infoItem}
          onClick={() => onEditChange('nicknme')}
        >
          <div className={Styles.title} style={{fontSize:'14px'}}>昵称：</div>
          <div className={Styles.text} style={{fontSize:'14px'}}>{info.nickname}</div>
          <div className={Styles.editRrrowRight} style={{fontSize:'12px'}}>
            <p>点此编辑</p>
            <img src={Assets.arrowGray} alt="" className={Styles.icon}/>
          </div>
        </div>

        <div
          className={Styles.infoItem}
          onClick={() => onEditChange('autograph')}
        >
          <div className={Styles.title} style={{fontSize:'14px'}}>个性签名：</div>
          <div className={Styles.text} style={{fontSize:'14px'}}>{info.autograph}</div>
          <div className={Styles.editRrrowRight} style={{fontSize:'12px'}}>
            <p>点此编辑</p>
            <img src={Assets.arrowGray} alt="" className={Styles.icon}/>
          </div>
        </div>

        <div className={Styles.infoItem}>
          <div className={Styles.title} style={{fontSize:'14px'}}>手机号：</div>
          <div className={Styles.text} style={{fontSize:'14px'}}>{mobileStr(info.mobile, 3, 2)}</div>
          <div className={Styles.icon} />
        </div>

        <div className={Styles.infoItem}>
          <div className={Styles.title} style={{fontSize:'14px'}}>邀请码：</div>
          <div className={Styles.text} style={{fontSize:'14px'}}>{info.invitationCode}</div>
          <div className={Styles.editRrrowRight} style={{fontSize:'12px'}} onClick={() => copyUtils(info.invitationCode)}>
            <p>点此复制</p>
            <img src={Assets.copy} alt="" className={Styles.icon} />
          </div>
        </div>

        <div className={Styles.infoItem} style={{marginTop:'20px'}}>
          <ButtonCom text='退出登录' block={true} type='logOut' width={220} height={48} color={appInfo?.theme?.baseColor} onPress={() => setVisible(true)} />
        </div>
        <Modal title="消息提示" style={{top:'35%'}} open={visible} okText="确定" cancelText="取消" onOk={logOut} onCancel={() => setVisible(false)}>
          <p>是否退出当前登录状态？</p>
        </Modal>
      </div>

      {/* 头像上传对话框 */}
      <div>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: '0',
          }}
          hidden={!avatarvisible}
        >
          <div className={Styles.maskModal} style={{ height: '320px' }}>
            <span className={Styles.modalTitle}>修改头像</span>
            {/* <Space direction="vertical">
              <LimitCount />
            </Space> */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '11px',
              }}
            >
              上传新头像
            </div>
            <div className={Styles.btn}>
              <ButtonCom text='取消' width={128} height={48} onPress={() => setAvatarVisible(false)} />
              <ButtonCom text='保存' type='primary' width={128} height={48} background={appInfo?.theme?.baseColor} color='#fff' onPress={saveAvatar} />
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default ProfilePage;
