import React from "react";
import { connect } from "../../../api/api";
import { Modal, Button } from "antd";

class Server extends React.Component {
  // 连接云手机
  handleConnect = serverId => {
    const params = {
      server_id: serverId,
      role: 2
    };
    connect(params)
      .then(res => {})
      .catch(e => {
        console.error(e);
      });
  };
  render() {
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>
            关闭
          </Button>
        ]}
        maskClosable={false}
      >
        <div>
          <iframe
            src="http://192.168.15.141:8080/doc/app_store_service_api.html"
            title="云手机"
            width="1204"
            height="768"
          />
        </div>
      </Modal>
    );
  }
}

export default Server;
