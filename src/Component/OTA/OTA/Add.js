import React from "react";
import UploadMirrorImage from "../../Upload/UploadMirrorImage";
import { uploadMirrorImage } from "../../../api/api";
import { Modal, Form, Input, message, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.state = {
        version: ""
      };
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传安装包
    handleUpload = formData => {
      uploadMirrorImage(formData)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            if (!this.props.visible) {
              return false;
            }
            this.props.handleSetMirrorImage(res.data.ftpPath, false);
            this.props.handleSetInfo(res.data);
            this.props.form.setFieldsValue({
              imageSize: res.data.imageSize,
              ftpPath: res.data.ftpPath
            });
            this.props.form.setFields({
              resource_address: {
                value: res.data.ftpPath,
                errors: []
              }
            });
          } else {
            message.error(res.message);
            this.props.handleUploadLoading(false);
            this.props.form.setFields({
              resource_address: {
                value: undefined,
                errors: [new Error("上传失败，请重新上传")]
              }
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    };

    // 检测安装包格式
    handleCheckType = file => {
      if (!file) {
        return false;
      } else if (false) {
        this.props.form.setFields({
          resource_address: {
            value: undefined,
            errors: [new Error("请上传zip文件")]
          }
        });
        this.props.handleSetMirrorImage("", false);
        this.props.onClearInfo();
        return false;
      } else {
        return true;
      }
    };

    // 验证镜像包大小
    imageSizeValidate = (rule, value, callback) => {
      if (value !== "" && value && isNaN(Number(value))) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };

    render() {
      const {
        visible,
        confirmLoading,
        isEdit,
        loadingUploadMirrorImage,
        handleUploadLoading,
        mirrorImageUrl,
        mirrorImageInfo,
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
          title={isEdit ? "编辑镜像包" : "新增镜像包"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="镜像包名称">
              {getFieldDecorator("imageName", {
                initialValue: values.imageName,
                rules: [
                  {
                    required: true,
                    message: "请输入镜像包名称"
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
              })(<Input placeholder="请输入镜像包名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="安卓版本号">
              {getFieldDecorator("androidVersion", {
                initialValue: values.androidVersion,
                rules: [
                  {
                    required: true,
                    message: "请输入安卓版本号"
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
              })(<Input placeholder="请输入安卓版本号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="内部版本号">
              {getFieldDecorator("maintainVersion", {
                // initialValue: moment(values.maintainVersion, "YYYY-MM-DD HH:mm:ss"),
                initialValue: values.maintainVersion,
                rules: [
                  {
                    required: true,
                    message: "请输入内部版本号"
                  },
                  {
                    max: 30,
                    message: "不能超过20个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(
                // <DatePicker
                //   // defaultValue={moment(values.maintainVersion, "YYYY-MM-DD HH:mm:ss")}
                //   showTime
                //   format="YYYY-MM-DD HH:mm:ss"
                //   placeholder="选择时间"
                //   onChange={this.onChange}
                //   onOk={this.onOk}
                // />
                <Input placeholder="请输入内部版本号" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="镜像包">
              {getFieldDecorator("resource_address", {
                initialValue: mirrorImageUrl,
                rules: [
                  {
                    required: false,
                    message: "请上传镜像包"
                  }
                ]
              })(
                <UploadMirrorImage
                  mirrorImageUrl={mirrorImageUrl}
                  loadingUploadMirrorImage={loadingUploadMirrorImage}
                  handleUpload={this.handleUpload}
                  handleUploadLoading={handleUploadLoading}
                  handleCheckType={this.handleCheckType}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="FTP路径">
              {getFieldDecorator("ftpPath", {
                initialValue: mirrorImageInfo.ftpPath || values.ftpPath,
                rules: [
                  {
                    required: true,
                    message: "请输入FTP路径，由上传镜像包后自动获取"
                  }
                ]
              })(<Input placeholder="由上传镜像包后自动获取" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="镜像包大小">
              {getFieldDecorator("imageSize", {
                initialValue: mirrorImageInfo.imageSize || values.imageSize,
                rules: [
                  {
                    required: true,
                    message: "请输入FTP路径，由上传镜像包后自动获取"
                  },
                  {
                    validator: this.imageSizeValidate
                  }
                ]
              })(<Input placeholder="由上传镜像包后自动获取" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator("memo", {
                initialValue: values.memo,
                rules: [
                  {
                    required: true,
                    message: "请输入备注"
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
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="开放ROOT权限">
              {getFieldDecorator("isRoot", {
                initialValue: !isNaN(Number(values.isRoot))
                  ? Number(values.isRoot)
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择是否开放ROOT权限"
                  }
                ]
              })(
                <Select placeholder="请选择是否开放ROOT权限">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
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
  constructor(props) {
    super();
    this.state = {
      mirrorImageInfo: {
        imageSize: undefined,
        ftpPath: undefined
      }
    };
    this.onClearInfo = this.onClearInfo.bind(this);
  }

  // 设置解析信息
  handleSetInfo = data => {
    this.setState({
      mirrorImageInfo: {
        imageSize: parseFloat(data.imageSize),
        ftpPath: data.ftpPath
      }
    });
  };

  // 清空解析信息
  onClearInfo = () => {
    this.setState({
      mirrorImageInfo: {
        imageSize: undefined,
        ftpPath: undefined
      }
    });
  };
  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      // values.maintainVersion = moment(values.maintainVersion).format(
      //   "YYYYMMDDHHmmss"
      // );
      values.imageSize = parseFloat(values.imageSize).toFixed(4);
      console.log("Received values of form: ", values);
      if (err) {
        return;
      }
      values.isRoot ? (values.isRoot = true) : (values.isRoot = false);
      values.imageName = values.imageName.trim();
      values.androidVersion = values.androidVersion.trim();
      values.ftpPath = values.ftpPath.trim();
      values.maintainVersion = values.maintainVersion.trim();
      values.memo = values.memo.trim();
      values.resource_address = values.resource_address.trim();

      // console.log("Received values of form: ", values);

      this.props.handleOk(values, isEdit, () => {
        form.resetFields();
      });
      this.onClearInfo();
    });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.onClearInfo();
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
        loadingUploadMirrorImage={this.props.loadingUploadMirrorImage}
        mirrorImageUrl={this.props.mirrorImageUrl}
        mirrorImageInfo={this.state.mirrorImageInfo}
        handleUploadLoading={this.props.handleUploadLoading}
        handleSetMirrorImage={this.props.handleSetMirrorImage}
        handleSetInfo={this.handleSetInfo}
        onClearInfo={this.onClearInfo}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
