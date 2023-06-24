/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Row, Col, Empty, Input } from "antd";
import classNames from "classnames";
import styles from "./index.less";
import "./index.less";
import Common from "@/utils/Common";

// addPx
const common = new Common();

class ProductTemplate4 extends Component {
  render() {
    const { dataSource } = this.props;
    if (!dataSource) {
      return <Empty description="无数据可操作" />;
    }

    return (
      <>
        <div
          className={styles.productRow}
          style={{
            boxSizing: "border-box",
            background: dataSource.bgColor,
            borderRadius: dataSource.borderRadius + "px",
            margin: common.addPx(dataSource.margin),
            padding: common.addPx(dataSource.padding),
          }}
        >
          {dataSource.goods.length > 0
            ? dataSource.goods.map((item, index) => {
                let borderRadius = '';
                if (index === 0) {
                  borderRadius = `${dataSource.borderRadius}px ${dataSource.borderRadius}px 0 0`;
                }else if (index === dataSource.goods.length-1) {
                  borderRadius = `0 0 ${dataSource.borderRadius}px ${dataSource.borderRadius}px`;
                }
                return (
                  <Row
                    key={index}
                    style={{ padding: "10px 0",background:'white',borderBottom:'1px solid #f0f0f0',borderRadius:`${borderRadius}` }}
                  >
                    <Col span={4} className={styles.item}>
                      <div className={styles.picture}>
                        <img
                          style={{ display: "block", width: "100%",borderRadius: `${dataSource.borderRadius}px` }}
                          src={item.image}
                          alt="商品图片"
                        />
                      </div>
                    </Col>
                    <Col
                      span={20}
                      className={styles.item}
                      style={{
                        boxSizing: "border-box",
                        padding: "6px 12px",
                      }}
                    >
                      <p
                        className="title dot1"
                        style={{
                          width:'100%',
                          lineHeight: "20px",
                          paddingBottom: "0px",
                          height: "25px",
                          textAlign: "left",
                          fontWeight: "bolder",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="tag-wrap"
                        style={{ minHeight: "16px", width: "100%" }}
                      >
                        {typeof item.tags !== "undefined"
                          ? item.tags &&
                            item.tags.map((itm, index) => {
                              return (
                                <em
                                  style={{
                                    color: itm.color,
                                    background: itm.bgColor,
                                    display: "inline-block",
                                    borderRadius: "0",
                                    textAlign: "center",
                                    height: "18px",
                                    lineHeight: "18px",
                                    fontSize: "12px",
                                    marginRight: "5px",
                                    padding: "0 5px",
                                  }}
                                  className="tag-item"
                                  key={index}
                                >
                                  {itm.name}
                                </em>
                              );
                            })
                          : ""}
                      </p>
                      <Row style={{ width: "100%", padding: "0" }}>
                        <Col span={20} className={styles.priceCol}>
                          <p
                            className="price"
                            style={{
                              fontWeight: "bold",
                              color: "#000000",
                              width: "auto",
                            }}
                          >
                            <em
                              className="tag"
                              style={{
                                left: "0",
                                fontWeight: "bold",
                                fontSize: "18px",
                                color: "#000000",
                                width: "auto",
                                position: "initial",
                              }}
                            >
                              ¥{item.price}
                            </em>
                            <em style={{color:'gray',marginLeft:'5px',fontSize:'12px',fontWeight:'normal'}}>已售: {item.sales} 件</em>
                          </p>
                        </Col>
                        <Col
                          span={4}
                          className="cart"
                          style={{
                            justifyContent: "flex-end",
                            display: "flex",
                          }}
                        >
                          <div
                            className="self-icon-wrap"
                            style={{
                              width: "20px",
                              height: "20px",
                              background: "none",
                              border: "none",
                            }}
                            hidden={!dataSource.hideCartIcon}
                          >
                            <img
                              src={dataSource.cartIcon}
                              style={{ width: "20px", height: "20px" }}
                            ></img>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                );
              })
            : ""}
        </div>
      </>
    );
  }
}

export default ProductTemplate4;
