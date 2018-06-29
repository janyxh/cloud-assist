import React from "react";
import { Row, Col } from "antd";

class FormDetail extends React.Component {
  render() {
    const { dataInfo } = this.props;
    return (
      <div className="row-show-table">
        <Row gutter={24}>
          <Col span={4}><label>内网IP：</label></Col>
          <Col span={4}>{dataInfo.local_ip}</Col>
          <Col span={4}><label>外网IP：</label></Col>
          <Col span={4}>{dataInfo.remote_desktop_ip}</Col>
          <Col span={4}><label>内部版本号：</label></Col>
          <Col span={4}>{dataInfo.version}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={4}><label>CPU使用率：</label></Col>
          <Col span={4}>{ dataInfo.used_cpu ? `${dataInfo.used_cpu * 1000000 / 10000}%` : `` }</Col>
          <Col span={4}><label>内存(MB)：</label></Col>
          <Col span={4}>{dataInfo.used_memory}/{dataInfo.total_memory}</Col>
          <Col span={4}><label>存储(MB)：</label></Col>
          <Col span={4}>{dataInfo.used_disk}/{dataInfo.total_disk}</Col>
          <Col span={4}><label>品牌：</label></Col>
          <Col span={4}>{dataInfo.brand}</Col>
          <Col span={4}><label>型号：</label></Col>
          <Col span={4}>{dataInfo.model}</Col>
          <Col span={4}><label>名称：</label></Col>
          <Col span={4}>{dataInfo.device_name}</Col>
          <Col span={4}><label>制造商：</label></Col>
          <Col span={4}>{dataInfo.manufacturer}</Col>
          <Col span={4}><label>build id：</label></Col>
          <Col span={4}>{dataInfo.build_id}</Col>
          <Col span={4}><label>安卓版本号：</label></Col>
          <Col span={4}>{dataInfo.android_version}</Col>
        </Row>
      </div>
    );
  }
}

export default FormDetail;
