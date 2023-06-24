import React, { Component, useEffect } from 'react';
import { Row, Col, Empty, Divider } from 'antd';
import classNames from 'classnames';
import Common from '@/utils/Common';

import "./Video.less"

const common = new Common();


const Video = (props: any) => {
    const { dataSource } = props;

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

    const videoStyle = {
        background: dataSource.bgColor,
        margin: marginStr,
        padding: paddingStr,
        borderRadius: `${dataSource.borderRadius}px`,
        height: dataSource.height + "px",
        width: "100%",
    };

    // useEffect(() => {
    //     document.getElementById('videoPlayer').play();
    //     console.log(dataSource);
    // }, [dataSource.video])

    return (
        <>
            <div
                className="video-box"
                style={videoStyle}
            >
                <video
                    controls={dataSource.controls}
                    autoPlay={dataSource.autoplay}
                    playsInline
                    poster={dataSource.poster}
                    id="videoPlayer"
                    style={{ width: "100%", height: "auto", display: "block",borderRadius: `${dataSource.borderRadius}px`, }}
                    src={dataSource.video}
                >
                    {/* <source
                        src={dataSource.video}
                        type="video/mp4"
                    /> */}
                </video>
            </div>
        </>
    )
}

export default Video;