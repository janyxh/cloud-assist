import React from "react";
import { Modal, Form, Input } from "antd";
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    state = {
      confirmDirty: false
    };
    // 密码验证
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      let chineseReg = /.*[\u4e00-\u9fa5]+.*$/; //汉字正则
      if (value && this.state.confirmDirty) {
        if (value.indexOf(" ") > 0) {
          callback(new Error("密码不得包含空格"));
        } else if (chineseReg.test(value)) {
          callback(new Error("密码不得包含汉字"));
        } else {
          form.validateFields(["confirm"], { force: true });
        }
      }
      callback();
    };

    // 再次输入密码
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue("newPassword")) {
        callback("请保持两次密码一致");
      } else {
        callback();
      }
    };

    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    render() {
      const {
        visible,
        confirmLoading,
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
          title="修改密码"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="旧密码">
              {getFieldDecorator("oldPassword", {
                rules: [
                  {
                    required: true,
                    message: "请输入旧密码"
                  },
                  {
                    max: 20,
                    message: "不能超过20个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(
                <Input
                  type="password"
                  placeholder="请输入旧密码"
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator("newPassword", {
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    message: "请输入新密码"
                  },
                  {
                    min: 6,
                    message: "不能少于6个字"
                  },
                  {
                    max: 20,
                    message: "不能超过20个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(
                <Input
                  type="password"
                  placeholder="请输入新密码"
                  autoComplete="off"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator("confirm", {
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    message: "请再次输入新密码"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  type="password"
                  placeholder="请再次输入密码"
                  onBlur={this.handleConfirmBlur}
                  autoComplete="off"
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class CollectionsPage extends React.Component {
  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.handleOk(values, isEdit, () => {
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
        isEdit={this.props.isEdit}
        values={this.props.values}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
