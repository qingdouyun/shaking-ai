import { CaretRightOutlined } from "@ant-design/icons";
import { Row, Col, Empty } from "antd";
import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import Common from "@/utils/Common";
import styles from "./Prompts.less";

// addPx
const common = new Common();

const TableView = (prop: any) => {
  const { dataSource } = prop;

  useEffect(() => {}, []);

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexFlow: "column",
        background: dataSource.bgColor,
        borderRadius: dataSource.borderRadius + "px",
        margin: common.addPx(dataSource.margin),
        padding: common.addPx(dataSource.padding),
      }}
    >
      {dataSource.prompts.map((item: any, index: number) => {
          let marginBottom = '0';
          if (index === dataSource.prompts.length-1) {
            marginBottom = '12px';
          }
          return (
            <div key={item.key} className={styles.prompt} style={{borderRadius: `${dataSource.borderRadius}px`,marginBottom:`${marginBottom}`}}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.content} style={{userSelect:'text'}}>{item.content}</p>
            </div>
          );
      })}
      {/* <div className='load-more'>
            <div className='lm-wrap'><IconFont icon='icon-shuaxin' style={{marginRight:'5px'}}/><em>加载更多</em></div>
        </div> */}
    </div>
  );
};

export default TableView;
