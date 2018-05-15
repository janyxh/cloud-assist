import React from "react";

import { Modal } from "antd";
import AddForm from "./AddForm";

class userModal extends React.Component {
  constructor(props) {
    super();
    this.handleOk = this.handleOk.bind(this);
  }
  handleOk = () => {
    this.props.handleOk();
  };
  render() {
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        confirmLoading={this.props.confirmLoading}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
      >
        <AddForm onOk={this.handleOk} />
      </Modal>
    );
  }
}

export default userModal;
