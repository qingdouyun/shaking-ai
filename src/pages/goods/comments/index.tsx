import {
  Button,
  Input,
  Toast,
  Checkbox,
  Form,
  CascadePicker,
  Image,
  InfiniteScroll,
  message,
  Pagination
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import api from '@/services/api';
import Styles from './index.module.less'
import { areaInfo } from '@/constant/address'
import { useLocation } from '@umijs/max';

import { ButtonCom, InputCom } from "@/components";

const RegisterPage = (props: any) => {
  const location = useLocation();
  const { goodsKey } = location.state;
  const [isApp, setIsApp] = useState(false); // 是否App打开
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  // useEffect(() => {
  //   const platform = props.location.query?.platform || '';
  //   setIsApp(platform === 'app');
  // }, [location.query]);

  useEffect(() => {
    console.log(location)
    api.goods.comments({
      pageNumber: 1,
      goodsKey: goodsKey,
    }).then((res) => {
      if (res.success) {
        setTotal(res.totalCount)
        if (res.data.length === 0) {
          message.info('暂无更多评论');
        } else {
          setComments(res.data);
        }
      } else {
        message.info(res.msg);
      }
    });
  }, []);

  const pageChange = (e) => {
    api.goods.comments({
      pageNumber: e,
      goodsKey: goodsKey,
    }).then((res) => {
      if (res.success) {
        setComments(res.data);
      } else {
        message.info(res.msg);
      }
    });
  }

  return (
    <>
      <div className='wyy-main page-width' style={{ maxWidth: '1100px' }}>
        {
          comments.map((v) => {
            return <>
              <div className={Styles.item}>
                <div className={Styles.info}>
                  <div className={Styles.iUser}>
                    <Image
                      width={50}
                      src={v.avatar}
                    />
                    <div>{v.nickName}</div>
                  </div>
                  <div style={{ fontSize: '14px' }}>{v.createDate}</div>
                </div>
                <div className={Styles.comment}>
                  <div style={{ fontSize: '14px' }}>{v.content}</div>
                  <div className={Styles.imgContainer}>
                    {v.images.length <= 2 ? v.images.map((j) => {
                      return <><Image width={80} className={Styles.iCTemplate1} src={j.path}
                      /></>
                    }) : v.images.map((k) => {
                      return <><Image width={80} className={Styles.iCTemplate2} src={k.path}
                      /></>
                    })}
                  </div>
                </div>
              </div>
            </>
          })
        }
        <Pagination defaultCurrent={1} total={total} style={{ marginTop: '20px' }} onChange={pageChange} />
      </div>
    </>
  );
};

export default RegisterPage;
