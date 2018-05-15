import React from "react";

import { Modal } from "antd";

class userModal extends React.Component {
  render() {
    return (
      <Modal
        title="Title"
        visible={this.props.visible}
        confirmLoading={this.props.confirmLoading}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
      >
        <p>rewrweree</p>
      </Modal>
    );
  }
}

export default userModal;
