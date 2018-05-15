import React from "react";
import TableInstall from "./Table";
import { Modal, Button } from "antd";

class CollectionsPage extends React.Component {
  render() {
    const { visibleInstall, isInstall, valuesInstall, gameName } = this.props;
    return (
      <Modal
        visible={visibleInstall}
        title={`${gameName}-${valuesInstall.channel_name}`}
        onCancel={this.props.onCancel}
        footer={[
          <Button key="back" onClick={this.props.onCancel}>
            关闭
          </Button>
        ]}
      >
        <TableInstall isInstall={isInstall} loading={this.props.loading} data={this.props.data} />
      </Modal>
    );
  }
}

export default CollectionsPage;
