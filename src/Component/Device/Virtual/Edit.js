import React from "react";
import { Modal, Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const {
        visible,
        confirmLoading,
        values,
        onCancel,
        onCreate,
        form
      } = this.props;

      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      };
      return (
        <Modal
          visible={visible}
          title="编辑云手机"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="云手机ID">
              <div>{values.server_id}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="云手机名字">
              {getFieldDecorator("server_name", {
                initialValue: values.server_name,
                rules: [
                  {
                    required: false,
                    message: "请输入设备名称"
                  }
                ]
              })(<Input placeholder="请输入设备名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备状态">
              {getFieldDecorator("server_status", {
                initialValue: values.server_status,
                rules: [
                  {
                    required: true,
                    message: "请选择设备状态"
                  }
                ]
              })(
                <Select placeholder="请选择设备状态">
                  <Option value={0}>未知状态</Option>
                  <Option value={1}>正常运行</Option>
                  <Option value={2}>锁定</Option>
                </Select>
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="是否禁用">
              {getFieldDecorator("is_forbidden", {
                initialValue:
                  values.is_forbidden !== undefined
                    ? Number(values.is_forbidden)
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择是否禁用"
                  }
                ]
              })(
                <Select placeholder="请选择是否禁用">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem> */}
          </Form>
        </Modal>
      );
    }
  }
);

class CollectionsPage extends React.Component {
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
        console.log(values)
      if (err) {
        return;
      }
      if (values.server_name && values.server_name !== "") {
        values.server_name = values.server_name.trim();
      }

      form.resetFields();
      this.props.handleOk(values, () => {
        form.resetFields();
      });
    });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.props.handleCancel();
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <CollectionCreateForm
        wrappedComponentRef={this.saveFormRef}
        visible={this.props.visible}
        confirmLoading={this.props.confirmLoading}
        values={this.props.values}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
      />
    );
  }
}

export default CollectionsPage;
