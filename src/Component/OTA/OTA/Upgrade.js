import React from "react";
import TableUpgrade from "./Table";
import { Modal, Button } from "antd";

class CollectionsPage extends React.Component {
  // 获取正常运行，未占用的列表
  handleGetList = () => {
    setTimeout(() => {
      this.refs.Upgrade.getList({});
    }, 50);
  };

  // 获取正常运行，未占用的列表的所有数据
  handleGetListAll = () => {
    this.refs.Upgrade.getList({ size: 100000000 }, true); // true 代表为显示全部
  };

  onCancel = () => {
    this.props.onCancelUpgrade();
    this.refs.Upgrade.handelClear();
  };
  render() {
    const { visibleUpgrade, values } = this.props;
    return (
      <Modal
        visible={visibleUpgrade}
        maskClosable={false}
        title={`${values.imageName}-${values.androidVersion}-${
          values.maintainVersion
        }`}
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
        <TableUpgrade ref="Upgrade" values={values} />
      </Modal>
    );
  }
}

export default CollectionsPage;
