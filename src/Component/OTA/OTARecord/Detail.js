import React from "react";
import TableDetail from "./TableDetail";
import { Modal, Button } from "antd";

class CollectionsPage extends React.Component {
  handelGetList() {
    setTimeout(() => {
      this.refs.TableDetail.getList({});
    }, 50);
  }

  onCancel = () => {
    this.props.onCancel();
    this.refs.TableDetail.handelClear();
  };
  render() {
    const { visibleDetail, values } = this.props;
    return (
      <Modal
        visible={visibleDetail}
        maskClosable={false}
        title={`OTA升级：${values.image_name || ""}-${values.android_version || ""}-${
          values.maintain_version || ""
        }  任务ID：${values.upgrade_id}`}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>
            关闭
          </Button>
        ]}
        width={1100}
      >
        <TableDetail ref="TableDetail" values={values} />
      </Modal>
    );
  }
}

export default CollectionsPage;
