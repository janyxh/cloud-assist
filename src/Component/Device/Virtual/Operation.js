import React from "react";
import TableOperationLog from "./TableOperationLog";
import { Modal, Button } from "antd";

class InstallDetail extends React.Component {
  handleGetlist = id => {
    setTimeout(() => {
      this.refs.TableOperationLog.getList(id, {});
    }, 50);
  };

  onCancel = () => {
    this.props.onCancel();
    this.refs.TableOperationLog.handelClear();
  };
  render() {
    return (
      <Modal
        title="操作日志"
        visible={this.props.visible}
        width={1100}
        onCancel={this.onCancel}
        footer={[
          <Button key="submit" onClick={this.onCancel}>
            关闭
          </Button>
        ]}
        maskClosable={false}
      >
        <TableOperationLog ref="TableOperationLog" />
      </Modal>
    );
  }
}

export default InstallDetail;
