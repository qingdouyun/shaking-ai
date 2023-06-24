import { CaretRightOutlined } from "@ant-design/icons";
import { Row, Col, Empty } from "antd";
import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import Common from "@/utils/Common";
import { history } from "@umijs/max";

// addPx
const common = new Common();

const ArticlesView = (prop: any) => {
  const { dataSource } = prop;

  useEffect(() => {}, []);

  return (
    <div
      style={{
        boxSizing: "border-box",
        background: dataSource.bgColor,
        borderRadius: dataSource.borderRadius + "px",
        margin: common.addPx(dataSource.margin),
        padding: common.addPx(dataSource.padding),
      }}
    >
      <div style={{ display: "flex", flexFlow: "column", borderRadius: dataSource.borderRadius + "px", }}>
        {dataSource.articles.map((item: any) => {
          return (
            <Row
              key={item.key}
              style={{
                flexFlow: "row",
                height: "100px",
                padding: "15px",
                borderBottom: "1px solid #f0f0f0",
                background: '#ffffff'
              }}
              onClick={()=>{history.push('/article/detail/' + item.key,{'window':{'title':item.title}});}}
            >
              <Col
                span={21}
                style={{
                  flexFlow: "column",
                  color: "#000",
                  fontWeight: "500",
                  marginRight: "5px",
                }}
              >
                <p>{item.title}</p>
                <em
                  style={{
                    position: "absolute",
                    bottom: 0,
                    color: "#b5b5b5",
                    fontSize: "12px",
                  }}
                >
                  {item.createDate}
                </em>
              </Col>
              <Col span={3}>
                <img
                  style={{ width: "100%", height: "100%",borderRadius: `${dataSource.borderRadius}px` }}
                  src={item.image}
                />
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export default ArticlesView;
