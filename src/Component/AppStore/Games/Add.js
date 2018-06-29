import React from "react";
import UploadIcon from "../../Upload/UploadIcon";
import { uploadIcon } from "../../../api/api";
import { Modal, Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.state = {
        loading: false,
        defaultTip: true,
        loadingUploadIcon: false
      };
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传图片
    handleUpload = formData => {
      this.setState({
        loadingUploadIcon: true,
        defaultTip: false
      });
      uploadIcon(formData)
        .then(res => {
          this.setState({
            loadingUploadIcon: false
          });
          this.props.handleSetIcon(res.data);
          this.props.form.setFields({
            game_icon: {
              value: res.data,
              errors: []
            }
          });
        })
        .catch(e => {
          console.error(e);
        });
    };

    // 检测安装包格式
    handleCheckType = file => {
      if (!file) {
        return false;
      } else if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif" &&
        file.type !== "image/bmp"
      ) {
        this.props.form.setFields({
          game_icon: {
            value: undefined,
            errors: [new Error("请上传jpg图片")]
          }
        });
        this.props.handleSetIcon("");
        return false;
      } else {
        const isLt2M = file.size / 1024 < 100;
        if (!isLt2M) {
          this.props.form.setFields({
            game_icon: {
              value: undefined,
              errors: [new Error("请上传100K以内的图片")]
            }
          });
          this.props.handleSetIcon("");
          this.setState({
            defaultTip: false
          });
        } else {
          // this.props.handleSetIcon("");
          return true;
        }
      }
    };

    // 选择应用类型，清空分类值
    onChangeDataType = id => {
      this.props.form.setFieldsValue({
        app_small_type: undefined
      });
      this.props.onChangeDataType(id);
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
          maskClosable={false}
        >
          <Form className="form-add">
            <FormItem {...formItemLayout} label="应用名称">
              {getFieldDecorator("game_name", {
                initialValue: values.game_name,
                rules: [
                  {
                    required: true,
                    message: "请输入应用名称"
                  },
                  {
                    max: 50,
                    message: "不能超过50个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
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
                  },
                  { validator: this.iconValidator }
                ]
              })(
                <UploadIcon
                  defaultTip={this.state.defaultTip}
                  imgUrl={imgUrl}
                  loadingUploadIcon={this.state.loadingUploadIcon}
                  handleUpload={this.handleUpload}
                  handleCheckType={this.handleCheckType}
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
                  onChange={this.onChangeDataType}
                >
                  {this.props.dataType && this.props.dataType.length > 0
                    ? this.props.dataType.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.appTypeName}
                        </Option>
                      ))
                    : null}
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
                  {this.props.dataClassify && this.props.dataClassify.length > 0
                    ? this.props.dataClassify.map(item => (
                        <Option value={item.appTypeName} key={item.id}>
                          {item.appTypeName}
                        </Option>
                      ))
                    : null}
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
      values.description = values.description.trim();
      values.game_name = values.game_name.trim();
      values.vendor = values.vendor.trim();
      // console.log("Received values of form: ", values);

      form.resetFields();
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
        imgUrl={this.props.imgUrl}
        dataType={this.props.dataType}
        dataClassify={this.props.dataClassify}
        onChangeDataType={this.props.onChangeDataType}
        handleSetIcon={this.props.handleSetIcon}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
