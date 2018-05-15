import React from "react";
import UploadIcon from "../../UploadIcon";
import { uploadIcon } from "../../../api/api";
import { Modal, Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.state = {
        loading: false
      };
      this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload = (formData, file) => {
      uploadIcon(formData)
        .then(res => {
          this.props.handleSetIcon(res.data);
        })
        .catch(e => {
          console.error(e);
        });
    };

    render() {
      const {
        visible,
        confirmLoading,
        isEdit,
        values,
        onCancel,
        onCreate,
        form,
        imgUrl
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
          title={isEdit ? "编辑游戏" : "新增游戏"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
        >
          <Form>
            <FormItem {...formItemLayout} label="应用名称">
              {getFieldDecorator("game_name", {
                initialValue: values.game_name,
                rules: [
                  {
                    required: true,
                    message: "请输入应用名称"
                  }
                ]
              })(<Input placeholder="请输入应用名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="应用图标">
              {getFieldDecorator("game_icon", {
                initialValue: imgUrl,
                rules: [
                  {
                    required: true,
                    message: "请上传图标"
                  }
                ]
              })(
                <UploadIcon imgUrl={imgUrl} handleUpload={this.handleUpload} />
              )}
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
            <FormItem {...formItemLayout} label="应用类型">
              {getFieldDecorator("app_big_type", {
                initialValue: values.app_big_type,
                rules: [
                  {
                    required: true,
                    message: "请选择应用类型"
                  }
                ]
              })(
                <Select
                  placeholder="请选择应用类型"
                  onChange={this.props.onChangeDataType}
                >
                  {this.props.dataType.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.appTypeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator("app_small_type", {
                initialValue: values.app_small_type,
                rules: [
                  {
                    required: true,
                    message: "请选择分类"
                  }
                ]
              })(
                <Select placeholder="请选择分类">
                  {this.props.dataClassify.map(item => (
                    <Option value={item.appTypeName} key={item.id}>
                      {item.appTypeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属平台">
              {getFieldDecorator("app_platform", {
                initialValue: values.app_platform,
                rules: [
                  {
                    required: true,
                    message: "请选择所属平台"
                  }
                ]
              })(
                <Select placeholder="请选择平台">
                  <Option value="android">安卓</Option>
                  <Option value="ios">苹果</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="厂商">
              {getFieldDecorator("vendor", {
                initialValue: values.vendor,
                rules: [
                  {
                    required: true,
                    message: "请输入厂商"
                  }
                ]
              })(<Input placeholder="请输入厂商" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="排序优先级">
              {getFieldDecorator("priority", {
                initialValue: values.priority,
                rules: [
                  {
                    required: true,
                    message: "请选择排序优先级"
                  }
                ]
              })(
                <Select placeholder="请选择优先级">
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
              {getFieldDecorator("shelf_status", {
                initialValue: values.shelf_status,
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
        imgUrl={this.props.imgUrl}
        dataType={this.props.dataType}
        dataClassify={this.props.dataClassify}
        secondCity={this.props.secondCity}
        onChangeDataType={this.props.onChangeDataType}
        handleSetIcon={this.props.handleSetIcon}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
