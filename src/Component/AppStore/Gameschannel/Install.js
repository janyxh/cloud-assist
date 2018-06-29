import React from "react";
import TableInstall from "./Table";
import { Modal, Button } from "antd";

class CollectionsPage extends React.Component {
  handleGetList = () => {
    setTimeout(() => {
      this.refs.TableInstall.getList({});
    }, 50);
  };
  // 获取正常运行，未占用的列表的所有数据
  handleGetListAll = () => {
    this.refs.TableInstall.getList({ size: 100000000 }, true); // true 代表为显示全部
  };
  onCancel = () => {
    this.props.onCancel();
    this.refs.TableInstall.handelClear();
  };
  render() {
    const { visibleInstall, isInstall, valuesInstall, gameName } = this.props;
    return (
      <Modal
        visible={visibleInstall}
        maskClosable={false}
        title={`${gameName}-${valuesInstall.channel_name}`}
        onCancel={this.onCancel}
        footer={[
          <Button key="all" type="primary" onClick={this.handleGetListAll}>
            显示全部
          </Button>,
          <Button key="back" onClick={this.onCancel}>
            关闭
          </Button>
        ]}
        width={1100}
      >
        <TableInstall
          ref="TableInstall"
          isInstall={isInstall}
          appId={valuesInstall.app_id}
          loading={this.props.loading}
          data={this.props.data}
        />
      </Modal>
    );
  }
}

export default CollectionsPage;
