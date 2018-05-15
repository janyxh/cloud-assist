import React from "react";
import UploadPackage from "../../UploadPackage";
import { uploadApk } from "../../../api/api";
import { Modal, Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.state = {
        loading: false,
        app_size: 0,
        package_name: "",
        version: ""
      };
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传安装包
    handleUpload = formData => {
      uploadApk(formData)
        .then(res => {
          this.props.handleSetApk(res.data.path, false);
          this.setState({
            app_size: parseFloat(res.data.apkSize),
            package_name: res.data.packageName,
            version: res.data.versionName
          });
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
        apkUrl,
        loadingUploadApk,
        handleUploadLoading,
        game_info,
        onCancel,
        onCreate,
        form
      } = this.props;

      console.log(values);

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
          title={isEdit ? "编辑渠道包" : "新增渠道包"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
        >
          <Form>
            <FormItem {...formItemLayout} label="应用名称">
              {getFieldDecorator("game_id", {
                initialValue: game_info.game_id || undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择应用名称"
                  }
                ]
              })(
                <Select placeholder="请选择应用名称">
                  {this.props.gameList.map((item, index) => (
                    <Option value={item.game_id} key={item.game_id}>
                      {item.game_name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属平台">
              {getFieldDecorator("app_platform", {
                initialValue: game_info.app_platform,
                rules: [
                  {
                    required: true,
                    message: "请选择所属平台"
                  }
                ]
              })(
                <Select placeholder="请选择所属平台">
                  <Option value="android">安卓</Option>
                  <Option value="ios">苹果</Option>
                </Select>
              )}
            </FormItem>
            {isEdit ? (
              <FormItem {...formItemLayout} label="应用ID">
                {getFieldDecorator("game_id", {
                  initialValue: game_info.game_id,
                  rules: [
                    {
                      required: true,
                      message: "请输入应用ID"
                    }
                  ]
                })(<Input type="number" disabled />)}
              </FormItem>
            ) : null}
            {isEdit ? (
              <FormItem {...formItemLayout} label="APPID">
                {getFieldDecorator("app_id", {
                  initialValue: values.app_id,
                  rules: [
                    {
                      required: true,
                      message: "请输入APPID"
                    }
                  ]
                })(<Input type="number" disabled />)}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="渠道商">
              {getFieldDecorator("channel_name", {
                initialValue: values.channel_name,
                rules: [
                  {
                    required: true,
                    message: "请输入渠道商"
                  }
                ]
              })(<Input placeholder="请输入渠道商" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="安装包">
              {getFieldDecorator("resource_address", {
                initialValue: apkUrl,
                rules: [
                  {
                    required: true,
                    message: "请上传安装包"
                  }
                ]
              })(
                <UploadPackage
                  apkUrl={apkUrl}
                  loadingUploadApk={loadingUploadApk}
                  handleUpload={this.handleUpload}
                  handleUploadLoading={handleUploadLoading}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="包名">
              {getFieldDecorator("package_name", {
                initialValue: values.package_name || this.state.package_name,
                rules: [
                  {
                    required: true,
                    message: "请输入包名，由上传安装包后自动获取"
                  }
                ]
              })(<Input placeholder="由上传安装包后自动获取" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="应用大小(MB)">
              {getFieldDecorator("app_size", {
                initialValue: values.app_size || this.state.app_size,
                rules: [
                  {
                    required: true,
                    message: "请输入应用大小，由上传安装包后自动获取"
                  }
                ]
              })(<Input placeholder="由上传安装包后自动获取" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="版本号">
              {getFieldDecorator("version", {
                initialValue: values.version || this.state.version,
                rules: [
                  {
                    required: true,
                    message: "请输入版本号，由上传安装包后自动获取"
                  }
                ]
              })(<Input placeholder="由上传安装包后自动获取" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="展示状态">
              {getFieldDecorator("channel_show", {
                initialValue: values.channel_show,
                rules: [
                  {
                    required: true,
                    message: "请选择展示状态"
                  }
                ]
              })(
                <Select placeholder="请选择展示状态">
                  <Option value={1}>展示</Option>
                  <Option value={0}>隐藏</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否ROOT权限">
              {getFieldDecorator("is_root", {
                initialValue: values.is_root,
                rules: [
                  {
                    required: true,
                    message: "请选择是否ROOT权限"
                  }
                ]
              })(
                <Select placeholder="请选择是否ROOT权限">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否自动更新">
              {getFieldDecorator("auto_update", {
                initialValue: values.auto_update,
                rules: [
                  {
                    required: true,
                    message: "请选择是否自动更新"
                  }
                ]
              })(
                <Select placeholder="请选择是否自动更新">
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
        apkUrl={this.props.apkUrl}
        game_info={this.props.game_info}
        dataType={this.props.dataType}
        dataClassify={this.props.dataClassify}
        gameList={this.props.gameList}
        onChangeDataType={this.props.onChangeDataType}
        handleSetApk={this.props.handleSetApk}
        handleUploadLoading={this.props.handleUploadLoading}
        loadingUploadApk={this.props.loadingUploadApk}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
