import React, { Component, useEffect } from 'react';
import { Row, Col, Empty, Divider } from 'antd';
import Common from '@/utils/Common';

import "./RichText.less"

const common = new Common();

const RichText = (props: any) => {
    const { dataSource } = props;

    return (
        <>
            <Row style={{
                    background: dataSource.bgColor,
                    borderRadius: dataSource.borderRadius + 'px',
                    margin: common.addPx(dataSource.margin),
                    padding: common.addPx(dataSource.padding),
                    width: '100%',
                    minHeight:'280px'
                }}
                className="rich-text-content"
            >
                <div dangerouslySetInnerHTML={{ __html: dataSource.content }} style={{ padding: '10px',color:'revert' }} />
            </Row>
        </>
    )
}

export default RichText;