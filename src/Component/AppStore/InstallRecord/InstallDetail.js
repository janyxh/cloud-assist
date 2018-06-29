import React from "react";
import TableDetail from "./TableDetail";
import { Modal, Button } from "antd";

class InstallDetail extends React.Component {
  handleGetlist = id => {
    setTimeout(() => {
      this.refs.TableInstall.getList(id, {});
    }, 50);
  };

  onCancel = () => {
    this.props.onCancel();
    this.refs.TableInstall.handelClear();
  };
  render() {
    const { visible, values } = this.props;
    return (
      <Modal
        visible={visible}
        maskClosable={false}
        title={`应用${
          values.type === "install"
            ? "安装"
            : values.type === "uninstall"
              ? "卸载"
              : ""
        }：${values.game_name}-${values.channel_name}`}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        <TableDetail ref="TableInstall" />
      </Modal>
    );
  }
}

export default InstallDetail;
