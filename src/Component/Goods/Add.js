import React from "react";
import { Modal, Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    // 验证商品规格
    amountValidate = (rule, value, callback) => {
      if (value !== "" && value && !Number.isInteger(Number(value))) {
        callback(new Error("请输入整数"));
      } else {
        const price = Number(this.props.form.getFieldValue("price"));
        this.props.handleSetUnivalent(price, Number(value));
        callback();
      }
    };

    // 验证商品价格
    priceValidate = (rule, value, callback) => {
      if (value !== "" && value && !Number.isInteger(Number(value))) {
        callback(new Error("请输入整数"));
      } else {
        const amount = Number(this.props.form.getFieldValue("amount"));
        this.props.handleSetUnivalent(Number(value), amount);
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
      return (
        <Modal
          visible={visible}
          title={isEdit ? "编辑商品" : "新增商品"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator("name", {
                initialValue: values.name,
                rules: [
                  {
                    required: true,
                    message: "请输入商品名称"
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
              })(<Input placeholder="请输入商品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品类型">
              {getFieldDecorator("goodsType", {
                initialValue: values.goodsType,
                rules: [
                  {
                    required: true,
                    message: "请选择商品类型"
                  }
                ]
              })(
                <Select placeholder="请选择商品类型">
                  <Option value={2}>挂机点</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格">
              {getFieldDecorator("amount", {
                initialValue: values.amount
                  ? values.amount.toString()
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: "请输入商品规格"
                  },
                  { validator: this.amountValidate },
                  {
                    max: 20,
                    message: "不能超过20个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(<Input maxLength="9" placeholder="请输入商品规格" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格(元)">
              {getFieldDecorator("price", {
                initialValue: values.price
                  ? (Number(values.price) / 100).toString()
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: "请输入商品价格"
                  },
                  { validator: this.priceValidate },
                  {
                    max: 20,
                    message: "不能超过20个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(<Input maxLength="9" placeholder="请输入商品价格" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="单价(元/点)">
              {getFieldDecorator("univalent", {
                initialValue:
                  (this.props.univalent && this.props.univalent.toFixed(2)) ||
                  (Number(values.price) / Number(values.amount) / 100 &&
                    (
                      Number(values.price) /
                      Number(values.amount) /
                      100
                    ).toFixed(2)) ||
                  undefined,
                rules: [
                  {
                    required: true,
                    message: "请输入单价"
                  }
                ]
              })(
                <Input
                  maxLength="9"
                  placeholder="请输入单价，由价格和规格计算生成"
                  disabled
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="文字描述">
              {getFieldDecorator("description", {
                initialValue: values.description,
                rules: [
                  {
                    required: true,
                    message: "请输入文字描述"
                  },
                  {
                    max: 30,
                    message: "不能超过30个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(<Input placeholder="请输入文字描述" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动">
              {getFieldDecorator("promotion", {
                initialValue:
                  values.promotion !== undefined
                    ? Number(values.promotion)
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择活动"
                  }
                ]
              })(
                <Select placeholder="请选择活动">
                  <Option value={1}>有</Option>
                  <Option value={0}>无</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="页头标">
              {getFieldDecorator("pageFlag", {
                initialValue:
                  values.pageFlag !== undefined
                    ? Number(values.pageFlag)
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择页头标"
                  }
                ]
              })(
                <Select placeholder="请选择页头标">
                  <Option value={1}>有</Option>
                  <Option value={0}>无</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator("orderId", {
                initialValue: values.orderId,
                rules: [
                  {
                    required: true,
                    message: "请选择排序"
                  }
                ]
              })(
                <Select placeholder="请选择排序">
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                  <Option value={5}>5</Option>
                  <Option value={6}>6</Option>
                  <Option value={7}>7</Option>
                  <Option value={8}>8</Option>
                  <Option value={9}>9</Option>
                  <Option value={10}>10</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="上架状态">
              {getFieldDecorator("status", {
                initialValue:
                  values.status !== undefined
                    ? Number(values.status)
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择上架状态"
                  }
                ]
              })(
                <Select placeholder="请选择上架状态">
                  <Option value={1}>上架</Option>
                  <Option value={0}>下架</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class CollectionsPage extends React.Component {
  state = {
    univalent: undefined
  };
  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.description = values.description.trim();
      values.name = values.name.trim();
      values.amount = Number(values.amount);
      values.price = Number(values.price) * 100;
      // console.log("Received values of form: ", values);

      form.resetFields();
      this.setState({
        univalent: undefined
      });
      this.props.handleOk(values, isEdit, () => {
        form.resetFields();
      });
    });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({
      univalent: undefined
    });
    this.props.handleCancel();
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleSetUnivalent = (price, amount) => {
    this.setState({
      univalent: price / amount
    });
  };
  render() {
    return (
      <CollectionCreateForm
        wrappedComponentRef={this.saveFormRef}
        visible={this.props.visible}
        confirmLoading={this.props.confirmLoading}
        isEdit={this.props.isEdit}
        values={this.props.values}
        univalent={this.state.univalent}
        handleSetUnivalent={this.handleSetUnivalent}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
