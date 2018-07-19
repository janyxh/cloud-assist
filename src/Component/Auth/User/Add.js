import React from "react";
import { phoneRegCheck } from "../../../Common/regularCheck";
import { Modal, Form, Input, Radio } from "antd";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    state = {
      confirmDirty: false
    };
    // 密码验证
    validateToNextPassword = (rule, value, callback) => {
      if (!this.props.isEdit && !value) {
        callback(new Error("请输入密码"));
      }
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
      if (!this.props.isEdit && !value) {
        callback(new Error("请再次输入密码"));
      }
      const form = this.props.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("请保持两次密码一致");
      } else {
        callback();
      }
    };

    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    // 验证QQ
    qqValidate = (rule, value, callback) => {
      if (value && value && !Number.isInteger(Number(value))) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };

    // 验证手机号
    phoneValidator = (rule, value, callback) => {
      if (value && !phoneRegCheck(value.trim())) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };

    render() {
      const {
        visible,
        confirmLoading,
        isEdit,
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
      // let isOn = isEdit ? true : false;
      return (
        <Modal
          visible={visible}
          title={isEdit ? "编辑用户" : "新增用户"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator("loginAccount", {
                initialValue: values.loginAccount,
                rules: [
                  {
                    required: true,
                    message: "请输入用户名"
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
                  placeholder="请输入用户名，保存后不可修改"
                  autoComplete="off"
                  disabled={isEdit}
                />
              )}
            </FormItem>
            {!isEdit ? (
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    <span style={{ color: "red", "font-family": "SimSun" }}>
                      *{" "}
                    </span>密码
                  </span>
                }
              >
                {getFieldDecorator("password", {
                  validateTrigger: "onBlur",
                  rules: [
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
                    placeholder="请输入密码"
                    autoComplete="off"
                  />
                )}
              </FormItem>
            ) : null}
            {!isEdit ? (
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    <span style={{ color: "red", "font-family": "SimSun" }}>
                      *{" "}
                    </span>确认密码
                  </span>
                }
              >
                {getFieldDecorator("confirm", {
                  validateTrigger: "onBlur",
                  rules: [
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
            ) : null}
            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator("sex", {
                initialValue: values.sex,
                rules: [
                  {
                    required: true,
                    message: "请选择性别"
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="真实姓名">
              {getFieldDecorator("realName", {
                initialValue: values.realName,
                rules: [
                  {
                    required: true,
                    message: "请输入真实姓名"
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
              })(<Input placeholder="请输入真实姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator("nickName", {
                initialValue: values.nickName,
                rules: [
                  {
                    required: true,
                    message: "请输入昵称"
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
              })(<Input placeholder="请输入昵称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="QQ">
              {getFieldDecorator("qq", {
                initialValue: values.qq,
                rules: [
                  {
                    required: true,
                    message: "请输入QQ"
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
                    validator: this.qqValidate
                  }
                ]
              })(<Input placeholder="请输入QQ" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="微信">
              {getFieldDecorator("weiXin", {
                initialValue: values.weiXin,
                rules: [
                  {
                    required: true,
                    message: "请输入微信"
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
              })(<Input placeholder="请输入微信" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator("phoneNumber", {
                initialValue: values.phoneNumber,
                rules: [
                  {
                    required: true,
                    message: "请输入手机号码"
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
                    validator: this.phoneValidator
                  }
                ]
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="部门">
              {getFieldDecorator("department", {
                initialValue: values.department,
                rules: [
                  {
                    required: true,
                    message: "请输入部门"
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
              })(<Input placeholder="请输入部门" />)}
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
      values.loginAccount = values.loginAccount.trim();
      values.realName = values.realName.trim();
      values.nickName = values.nickName.trim();
      values.qq = values.qq.trim();
      values.weiXin = values.weiXin.trim();
      values.phoneNumber = values.phoneNumber.trim();
      values.department = values.department.trim();
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
