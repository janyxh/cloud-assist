import React from "react";
import UploadPackage from "../../Upload/UploadPackage";
import { uploadApk } from "../../../api/api";
import { getGameInfo } from "../../../api/api";
import { Modal, Form, Input, Select, message } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传安装包
    handleUpload = formData => {
      uploadApk(formData)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            if (!this.props.visible) {
              return false;
            }
            this.props.handleSetApk(res.data.path, false);
            this.props.handleSetInfo(res.data);
            this.props.form.setFieldsValue({
              app_size: parseFloat(res.data.apkSize),
              version: res.data.versionName,
              package_name: res.data.packageName,
              resource_address: res.data.path,
              launch_activity: res.data.activity
            });
            let analysis = {};
            if (!res.data.path || res.data.path === "") {
              analysis.unPath = true;
            }
            if (!res.data.apkSize || res.data.apkSize === "") {
              analysis.unApkSize = true;
            }
            if (!res.data.versionName || res.data.versionName === "") {
              analysis.unVersion = true;
            }
            if (!res.data.packageName || res.data.packageName === "") {
              analysis.unPackageName = true;
            }
            if (!res.data.path || res.data.path === "") {
              analysis.unResourceAddress = true;
            }
            if (!res.data.activity || res.data.activity === "") {
              analysis.unLaunchActivity = true;
            }
            this.props.handleSetAnalysis(analysis);
            this.props.form.setFields({
              resource_address: {
                value: res.data.path
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
      }
      // else if (file.type !== "application/vnd.android.package-archive") {
      //   this.props.form.setFields({
      //     resource_address: {
      //       value: undefined,
      //       errors: [new Error("请上传apk文件")]
      //     }
      //   });
      //   this.props.handleSetApk("", false);
      //   this.props.onClearInfo();
      //   return false;
      // }
      else {
        return true;
      }
    };

    // 获取平台
    getAppPlatform = gameId => {
      const params = {
        game_id: gameId,
        fields: "app_platform"
      };
      getGameInfo(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.props.form.setFieldsValue({
              app_platform: res.data.app_platform
            });
          } else {
            message.error(res.message);
          }
        })
        .catch(e => {
          console.error(e);
        });
    };

    // 验证应用大小
    appSizeValidate = (rule, value, callback) => {
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
        values,
        apkUrl,
        appInfo,
        appPlatform,
        loadingUploadApk,
        handleUploadLoading,
        game_info,
        analysis,
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
          title={isEdit ? "编辑渠道包" : "新增渠道包"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
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
                <Select
                  placeholder="请选择应用名称"
                  onChange={this.getAppPlatform}
                  disabled={isEdit}
                >
                  {this.props.gameList && this.props.gameList.length > 0
                    ? this.props.gameList.map((item, index) => (
                        <Option value={item.game_id} key={item.game_id}>
                          {item.game_name}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属平台">
              {getFieldDecorator("app_platform", {
                initialValue: appPlatform || game_info.app_platform,
                rules: [
                  {
                    required: true,
                    message: "请输入所属平台"
                  }
                ]
              })(
                // <Select placeholder="请选择所属平台">
                // </Select>
                <Input
                  placeholder="请输入所属平台，由选择游戏后生成"
                  // value={appPlatform}
                  disabled
                />
                // <div>{appPlatform || game_info.app_platform}</div>
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
              })(<Input placeholder="请输入渠道商" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="安装包">
              {getFieldDecorator("ftppath", {
                initialValue: apkUrl,
                rules: [
                  {
                    required: false,
                    message: "请上传安装包"
                  }
                ]
              })(
                <UploadPackage
                  apkUrl={apkUrl}
                  loadingUploadApk={loadingUploadApk}
                  handleUpload={this.handleUpload}
                  handleUploadLoading={handleUploadLoading}
                  handleCheckType={this.handleCheckType}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="FTP路径">
              {getFieldDecorator("resource_address", {
                initialValue: apkUrl || values.resource_address,
                rules: [
                  {
                    required: true,
                    message: analysis.unPath
                      ? "未解析到信息，请输入FTP路径"
                      : "请输入FTP路径，由上传安装包后自动获取"
                  }
                ]
              })(
                <Input
                  placeholder={
                    analysis.unPath
                      ? "未解析到信息，请输入FTP路径"
                      : "请输入FTP路径，由上传安装包后自动获取"
                  }
                  // disabled={!analysis.unPath}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="包名">
              {getFieldDecorator("package_name", {
                initialValue: appInfo.package_name || values.package_name,
                rules: [
                  {
                    required: true,
                    message: analysis.unPackageName
                      ? "未解析到信息，请输入包名"
                      : "请输入包名，由上传安装包后自动获取"
                  },
                  {
                    max: 200,
                    message: "不能超过200个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(
                <Input
                  placeholder={
                    analysis.unPackageName
                      ? "未解析到信息，请输入包名"
                      : "请输入包名，由上传安装包后自动获取"
                  }
                  // disabled={!analysis.unPackageName}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="应用大小(MB)">
              {getFieldDecorator("app_size", {
                initialValue: appInfo.app_size || values.app_size,
                rules: [
                  {
                    required: true,
                    message: analysis.unApkSize
                      ? "未解析到信息，请输入应用大小"
                      : "请输入应用大小，由上传安装包后自动获取"
                  },
                  { validator: this.appSizeValidate }
                ]
              })(
                <Input
                  placeholder={
                    analysis.unApkSize
                      ? "未解析到信息，请输入应用大小"
                      : "请输入应用大小，由上传安装包后自动获取"
                  }
                  // disabled={!analysis.unApkSize}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="版本号">
              {getFieldDecorator("version", {
                initialValue: appInfo.version || values.version,
                rules: [
                  {
                    required: true,
                    message: analysis.unVersion
                      ? "未解析到信息，请输入版本号"
                      : "请输入版本号，由上传安装包后自动获取"
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
              })(
                <Input
                  placeholder={
                    analysis.unVersion
                      ? "未解析到信息，请输入版本号"
                      : "请输入版本号，由上传安装包后自动获取"
                  }
                  // disabled={!analysis.unVersion}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="主要启动包">
              {getFieldDecorator("launch_activity", {
                initialValue:
                  appInfo.activity ||
                  values.launch_activity ||
                  values.launch_service,
                rules: [
                  {
                    required: true,
                    message: analysis.unVersion
                      ? "未解析到信息，请输入主要启动包"
                      : "请输入主要启动包，由上传安装包后自动获取"
                  },
                  {
                    max: 200,
                    message: "不能超过200个字"
                  },
                  {
                    whitespace: true,
                    message: "输入内容不能是纯空格"
                  }
                ]
              })(
                <Input
                  placeholder={
                    analysis.unVersion
                      ? "未解析到信息，请输入主要启动包"
                      : "请输入主要启动包，由上传安装包后自动获取"
                  }
                  // disabled={!analysis.unLaunchActivity}
                />
              )}
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
            <FormItem {...formItemLayout} label="启动方式">
              {getFieldDecorator("launch", {
                initialValue:
                  appInfo.activity || values.launch_activity
                    ? 1
                    : values.launch_service
                      ? 0
                      : undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择启动方式"
                  }
                ]
              })(
                <Select placeholder="请选择启动方式">
                  <Option value={1}>activity</Option>
                  <Option value={0}>service</Option>
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
      appInfo: {
        app_size: undefined,
        package_name: undefined,
        version: undefined,
        activity: undefined
      },
      analysis: {
        unPath: false,
        unApkSize: false,
        unVersion: false,
        unPackageName: false,
        unResourceAddress: false,
        unLaunchActivity: false
      }
      // defaultText: "未解析出信息"
    };
    this.onClearInfo = this.onClearInfo.bind(this);
  }
  // 设置解析信息
  handleSetInfo = data => {
    this.setState({
      appInfo: {
        app_size: data.apkSize,
        package_name: data.packageName,
        version: data.versionName,
        activity: data.activity
      }
    });
  };

  // 清空解析信息
  onClearInfo = () => {
    this.setState({
      appInfo: {
        app_size: undefined,
        package_name: undefined,
        version: undefined,
        activity: undefined
      }
    });
  };

  // 设置解析信息权限
  handleSetAnalysis = data => {
    this.setState(
      {
        analysis: {
          unPath: data.unPath,
          unApkSize: data.unApkSize,
          unPackageName: data.unPackageName,
          unVersion: data.unVersion,
          unLaunchActivity: data.unLaunchActivity
        }
      },
      () => {
        // console.log(this.state.appInfo);
      }
    );
  };

  // 清空解析信息编辑权限
  onClearAnalysis = () => {
    this.setState({
      analysis: {
        unPath: false,
        unApkSize: false,
        unVersion: false,
        unPackageName: false,
        unResourceAddress: false,
        unLaunchActivity: false
      }
    });
  };

  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // const { app_size, package_name, version, launch_activity } = values;
      // const defaultText = this.state.defaultText;
      // if (app_size === defaultText) {
      //   values.app_size = "";
      // }
      // if (package_name === defaultText) {
      //   values.package_name = "";
      // }
      // if (version === defaultText) {
      //   values.version = "";
      // }
      // if (launch_activity === defaultText) {
      //   values.launch_activity = "";
      // }
      values.app_size = parseFloat(values.app_size).toFixed(4);
      values.channel_name = values.channel_name.trim();
      values.launch_activity = values.launch_activity.trim();
      values.package_name = values.package_name.trim();
      values.version = values.version.trim();
      if (!values.launch) {
        values.launch_service = values.launch_activity;
        delete values.launch_activity;
        delete values.launch;
      }

      // console.log("Received values of form: ", values);
      this.props.handleOk(values, isEdit, () => {
        form.resetFields();
      });
      this.onClearInfo();
      this.onClearAnalysis();
    });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.onClearInfo();
    this.onClearAnalysis();
    this.props.handleCancel();
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    return (
      <CollectionCreateForm
        ref="FormAdd"
        wrappedComponentRef={this.saveFormRef}
        visible={this.props.visible}
        confirmLoading={this.props.confirmLoading}
        isEdit={this.props.isEdit}
        values={this.props.values}
        apkUrl={this.props.apkUrl}
        appInfo={this.state.appInfo}
        handleSetInfo={this.handleSetInfo}
        analysis={this.state.analysis}
        handleSetAnalysis={this.handleSetAnalysis}
        // defaultText={this.state.defaultText}
        game_info={this.props.game_info}
        appPlatform={this.props.appPlatform}
        getAppPlatform={this.props.getAppPlatform}
        gameList={this.props.gameList}
        handleSetApk={this.props.handleSetApk}
        handleUploadLoading={this.props.handleUploadLoading}
        loadingUploadApk={this.props.loadingUploadApk}
        onClearInfo={this.onClearInfo}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
      />
    );
  }
}

export default CollectionsPage;
