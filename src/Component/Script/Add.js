import React from "react";
import UploadScript from "../Upload/UploadScript";
import { uploadScript, selectAppId } from "../../api/api";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Icon,
  message
} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super();
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传脚本
    handleUpload = formData => {
      // if (
      //   this.props.form.getFieldValue("resource_address") &&
      //   this.props.form.getFieldValue("resource_address") !== ""
      // ) {
      //   // 保存要删除的文件 - 点击确定时删除
      //   this.props.handleSaveWillDelFile(
      //     this.props.form.getFieldValue("resource_address")
      //   );
      // }
      uploadScript(formData)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            if (!this.props.visible) {
              return false;
            }
            this.props.handleSetInfo(res.data.versionName);
            this.props.handleSetScript(res.data.path, false);
            this.props.form.setFieldsValue({
              version: res.data.versionName
            });
            this.props.form.setFields({
              resource_address: {
                value: res.data.path,
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

    // 检测是否是编辑脚本
    handleCheckIsEdit = () => {
      if (this.props.isEdit) {
        const game_id = this.props.form.getFieldValue("game_id");
        const channel_name = this.props.form.getFieldValue("channel_name");
        const params = {
          game_id: game_id,
          channel_name: channel_name
        };
        return params;
      }
    };

    // 检测脚本文件格式
    handleCheckType = (file, appID) => {
      if (!appID) {
        const game_id = this.props.form.getFieldValue("game_id");
        const channel_name = this.props.form.getFieldValue("channel_name");
        if (game_id && channel_name) {
          this.props.form.setFields({
            resource_address: {
              value: undefined,
              errors: [new Error("网络不佳，请重新选择文件")]
            }
          });
        } else {
          this.props.form.setFields({
            resource_address: {
              value: undefined,
              errors: [new Error("请先选择游戏和渠道")]
            }
          });
        }
        return false;
      } else if (!file) {
        return false;
      } else if (file.name.indexOf("lua") < 0) {
        this.props.form.setFields({
          resource_address: {
            value: undefined,
            errors: [new Error("请上传lua文件")]
          }
        });
        this.props.handleSetScript("", false);
        this.props.handleSetInfo(undefined);
        return false;
      } else {
        return true;
      }
    };

    // 添加脚本列表
    handleAdd = () => {
      // console.log("添加");
      this.props.handleAdd();
    };
    // 减去脚本列表
    handleMinus = item => {
      // console.log("减去");
      this.props.handleMinus(item);
    };
    // 添加配置项列表
    handleAddOption = index => {
      // console.log("添加配置项");
      this.props.handleAddOption(index);
    };
    // 减去配置项列表
    handleMinusOption = (item, index) => {
      // console.log("减去配置项");
      this.props.handleMinusOption(item, index);
    };

    // 改变游戏清空渠道商值
    onChangeGame = id => {
      this.props.form.setFieldsValue({
        channel_name: undefined
      });
      this.props.handleSetAppId(undefined);
      this.props.onChangeGame(id);
      this.props.handleSetScript("", false);
      if (this.props.form.getFieldValue("version")) {
        this.props.form.setFields({
          version: {
            value: undefined
          },
          resource_address: {
            value: undefined
          }
        });
      }
    };

    // 改变渠道商值
    onChangeChannel = value => {
      this.props.handleSetScript("", false);
      if (this.props.form.getFieldValue("version")) {
        this.props.form.setFields({
          version: {
            value: undefined
          }
        });
      }
      const game_id = this.props.form.getFieldValue("game_id").toString();
      const params = {
        game_id: game_id,
        channel_name: value
      };
      this.getAppId(params);
    };

    // 根据游戏和渠道查询app id
    getAppId = (params, fn) => {
      selectAppId(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.props.handleSetAppId(res.data.app_id);
            this.props.form.setFields({
              resource_address: {
                value: undefined,
                errors: []
              }
            });
          } else {
            message.error(res.message);
            this.props.handleSetAppId(undefined);
          }
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
        scriptOptions,
        option,
        scriptUrl,
        loadingUploadScript,
        handleUploadLoading,
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
          title={isEdit ? "编辑脚本" : "新增脚本"}
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
          maskClosable={false}
        >
          <Form className="form-unconventional">
            <FormItem {...formItemLayout} label="游戏">
              {getFieldDecorator("game_id", {
                initialValue: values.game_id || undefined,
                rules: [
                  {
                    required: true,
                    message: "请选择游戏"
                  }
                ]
              })(
                <Select
                  placeholder="请选择游戏"
                  onChange={this.onChangeGame}
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
            <FormItem {...formItemLayout} label="渠道商">
              {getFieldDecorator("channel_name", {
                initialValue: values.channel_name,
                rules: [
                  {
                    required: true,
                    message: "请输入渠道商"
                  }
                ]
              })(
                <Select
                  placeholder="请选择所属渠道商"
                  onChange={this.onChangeChannel}
                  disabled={isEdit}
                >
                  {this.props.channel_names &&
                  this.props.channel_names.length > 0
                    ? this.props.channel_names.map((item, index) => (
                        <Option value={item} key={index}>
                          {item}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="脚本名称">
              {getFieldDecorator("script_name", {
                initialValue: values.script_name,
                rules: [
                  {
                    required: true,
                    message: "请输入脚本名称"
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
              })(<Input placeholder="请输入脚本名称" />)}
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
            <FormItem {...formItemLayout} label="脚本文件">
              {getFieldDecorator("resource_address", {
                initialValue: scriptUrl,
                rules: [
                  {
                    required: true,
                    message: "请上传脚本文件"
                  }
                ]
              })(
                <UploadScript
                  scriptUrl={scriptUrl}
                  loadingUploadScript={loadingUploadScript}
                  appID={this.props.appID}
                  isEdit={isEdit}
                  handleClearAppID={this.handleClearAppID}
                  handleUpload={this.handleUpload}
                  handleUploadLoading={handleUploadLoading}
                  handleCheckType={this.handleCheckType}
                  handleCheckIsEdit={this.handleCheckIsEdit}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="版本号">
              {getFieldDecorator("version", {
                initialValue: this.props.version || values.version,
                rules: [
                  {
                    required: true,
                    message: "请输入版本号，由上传安装包后自动获取"
                  }
                ]
              })(<Input placeholder="由上传安装包后自动获取" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="星级">
              {getFieldDecorator("star_count", {
                initialValue: values.star_count,
                rules: [
                  {
                    required: true,
                    message: "请选择星级"
                  }
                ]
              })(
                <Select placeholder="请选择星级">
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                  <Option value={5}>5</Option>
                </Select>
              )}
            </FormItem>
            {scriptOptions && scriptOptions.length > 0
              ? scriptOptions.map((item, index) => (
                  <div key={index}>
                    <FormItem
                      {...formItemLayout}
                      label={`列表${index + 1}`}
                      key={index}
                    >
                      <Row gutter={8}>
                        <Col span={16}>
                          {getFieldDecorator(`name${index}`, {
                            initialValue: scriptOptions[index].name,
                            rules: [
                              {
                                required: true,
                                message: `请输入列表${index + 1}名称`
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
                            <Input placeholder={`请输入列表${index + 1}名称`} />
                          )}
                        </Col>
                        <Col span={8}>
                          {index === 0 ? (
                            <Button onClick={this.handleAdd}>
                              <Icon type="plus" />
                            </Button>
                          ) : (
                            <Button onClick={this.handleMinus.bind(this, item)}>
                              <Icon type="minus" />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </FormItem>

                    {option && option.length > 0
                      ? option[index].map((itemOp, indexOp) => (
                          <FormItem
                            {...formItemLayout}
                            label={`配置${indexOp + 1}`}
                            key={indexOp}
                          >
                            <Row gutter={8}>
                              <Col span={16}>
                                {getFieldDecorator(
                                  `option${index}s${indexOp}`,
                                  {
                                    initialValue: itemOp,
                                    rules: [
                                      {
                                        required: true,
                                        message: `请输入配置项${indexOp +
                                          1}名称`
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
                                  }
                                )(
                                  <Input
                                    placeholder={`请输入配置项${indexOp +
                                      1}名称`}
                                  />
                                )}
                              </Col>
                              <Col span={8}>
                                {indexOp === 0 ? (
                                  <Button
                                    onClick={this.handleAddOption.bind(
                                      this,
                                      index
                                    )}
                                  >
                                    <Icon type="plus" />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={this.handleMinusOption.bind(
                                      this,
                                      itemOp,
                                      index
                                    )}
                                  >
                                    <Icon type="minus" />
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          </FormItem>
                        ))
                      : null}
                  </div>
                ))
              : null}

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
  state = {
    version: undefined,
    appID: undefined,
    willDelFile: []
  };

  // //保存要删除的文件
  // handleSaveWillDelFile = path => {
  //   const arr = [];
  //   arr.push(path);
  //   this.setState({ willDelFile: this.state.willDelFile.concat(arr) });
  // };
  // 清空appID
  handleClearAppID = () => {
    this.setState({
      appID: undefined
    });
  };
  // 设置版本号
  handleSetInfo = version => {
    this.setState({
      version: version
    });
  };
  // 设置appID
  handleSetAppId = appID => {
    this.setState({
      appID: appID
    });
  };
  handleCreate = isEdit => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      console.log("values", values);
      if (err) {
        return;
      }

      values.description = values.description.trim();
      values.script_name = values.script_name.trim();

      form.resetFields();
      this.props.handleOk(values, isEdit, () => {
        form.resetFields();
      });

      this.setState({
        version: undefined,
        appID: undefined
      });

      // if (this.state.willDelFile.length > 0) {
      //   const arr = Array.from(new Set(this.state.willDelFile));
      //   arr.splice(arr.indexOf(values.resource_address), 1);
      //   arr.forEach(item => {
      //     this.handleDeleteFile(item);
      //   });

      //   this.setState({ willDelFile: [] });
      //   console.log(this.state.willDelFile);
      // }
    });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({
      version: undefined,
      appID: undefined
    });
    this.props.handleCancel();
    // if (
    //   form.getFieldValue("resource_address") &&
    //   form.getFieldValue("resource_address") !== ""
    // ) {
    //   this.handleDeleteFile(form.getFieldValue("resource_address"));
    // }
  };
  //删除脚本
  // handleDeleteFile = path => {
  // let formData = new FormData(); //初始化时将form Dom对象传入
  // formData.append("path", path);
  // deleteFile(formData)
  //   .then(res => {
  //     // const { code } = res;
  //     // if (code === "00") {
  //     //   message.success(res.message);
  //     // } else {
  //     //   message.error(res.message);
  //     // }
  //     console.log(res.message);
  //   })
  //   .catch(e => {
  //     console.error(e)
  //   });
  // };

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
        scriptOptions={this.props.scriptOptions}
        option={this.props.option}
        scriptUrl={this.props.scriptUrl}
        appID={this.state.appID}
        version={this.state.version}
        gameList={this.props.gameList}
        channel_names={this.props.channel_names}
        handleSetScript={this.props.handleSetScript}
        handleUploadLoading={this.props.handleUploadLoading}
        loadingUploadScript={this.props.loadingUploadScript}
        // handleDeleteFile={this.handleDeleteFile}
        // handleSaveWillDelFile={this.handleSaveWillDelFile}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate.bind(this, this.props.isEdit)}
        handleSetInfo={this.handleSetInfo}
        handleSetAppId={this.handleSetAppId}
        onChangeGame={this.props.onChangeGame}
        handleAdd={this.props.handleAdd}
        handleMinus={this.props.handleMinus}
        handleAddOption={this.props.handleAddOption}
        handleMinusOption={this.props.handleMinusOption}
      />
    );
  }
}

export default CollectionsPage;
