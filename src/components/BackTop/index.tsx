import { RocketOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

const Video = (props: any) => {
    const { dataSource } = props;
    const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

    //回到顶部
    const backTopRef = useRef(null) // 初始值
    useEffect(()=>{
        window.onscroll = function() {
            if(backTopRef.current !== null){
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > 1000){
                backTopRef.current.style.display = "flex";
                }else {
                backTopRef.current.style.display = "none";
                }
            }
        }
    },[]);
    
    return (
        <>
            <div className='back-top' style={{background:appInfo?.theme?.baseColor}} ref={backTopRef} onClick={()=>{document.body.scrollIntoView();}}>
                <div className='back-top-btn'><RocketOutlined style={{fontSize:'22px',color:'white'}}/></div>
            </div>
        </>
    )
}

export default Video;