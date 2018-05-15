import React from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.state = {
        loading: false,
        version: ""
      };
    }

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

      // console.log(values);

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
        >
          <Form>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator("name", {
                initialValue: values.name,
                rules: [
                  {
                    required: true,
                    message: "请输入商品名称"
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
                    message: "请输入商品类型"
                  }
                ]
              })(
                <Select placeholder="请输入商品类型">
                  <Option value={2}>挂机点</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格">
              {getFieldDecorator("amount", {
                initialValue: values.amount,
                rules: [
                  {
                    required: true,
                    message: "请输入商品规格"
                  }
                ]
              })(<InputNumber placeholder="请输入商品规格" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="文字描述">
              {getFieldDecorator("description", {
                initialValue: values.description,
                rules: [
                  {
                    required: true,
                    message: "请输入文字描述"
                  }
                ]
              })(<Input placeholder="请输入文字描述" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格(元)">
              {getFieldDecorator("price", {
                initialValue: values.price,
                rules: [
                  {
                    required: true,
                    message: "请输入商品价格"
                  }
                ]
                // })(<Input type="number" placeholder="请输入商品价格" />)}
              })(<InputNumber placeholder="请输入商品价格" />)}
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
  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);

      form.resetFields();
      this.props.handleOk(values, isEdit);
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
        scriptOptions={this.props.scriptOptions}
        option={this.props.option}
        scriptUrl={this.props.scriptUrl}
        dataType={this.props.dataType}
        dataClassify={this.props.dataClassify}
        gameList={this.props.gameList}
        onChangeDataType={this.props.onChangeDataType}
        handleSetScript={this.props.handleSetScript}
        handleUploadLoading={this.props.handleUploadLoading}
        loadingUploadScript={this.props.loadingUploadScript}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
        handleAdd={this.props.handleAdd}
        handleMinus={this.props.handleMinus}
        handleAddOption={this.props.handleAddOption}
        handleMinusOption={this.props.handleMinusOption}
      />
    );
  }
}

export default CollectionsPage;
