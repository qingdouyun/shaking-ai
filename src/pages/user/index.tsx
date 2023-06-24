import React, { useEffect, useState } from 'react';

//菜单内容
import Profile from './profile/index';

const MemberHome = (props: any) => {

  useEffect(() => {
    
  }, []);


  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>个人资料</p></div>
      <Profile />
    </>
  );
}


export default MemberHome;
