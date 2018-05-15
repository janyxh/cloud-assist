import React from "react";
import UploadScript from "../UploadScript";
import { uploadScript } from "../../api/api";
import { Modal, Form, Input, Select, Row, Col, Button, Icon } from "antd";
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
      this.handleUpload = this.handleUpload.bind(this);
    }

    // 上传脚本
    handleUpload = formData => {
      uploadScript(formData)
        .then(res => {
          this.props.handleSetScript(res.data.path, false);
          this.setState({
            version: res.data.versionName
          });
        })
        .catch(e => {
          console.error(e);
        });
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

      // console.log(values);
      // console.log(scriptOptions);

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
        >
          <Form>
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
                <Select placeholder="请选择游戏">
                  {this.props.gameList.map((item, index) => (
                    <Option value={item.game_id} key={item.game_id}>
                      {item.game_name}
                    </Option>
                  ))}
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
              })(<Input placeholder="请输入渠道商" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="脚本名称">
              {getFieldDecorator("script_name", {
                initialValue: values.script_name,
                rules: [
                  {
                    required: true,
                    message: "请输入脚本名称"
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
                  handleUpload={this.handleUpload}
                  handleUploadLoading={handleUploadLoading}
                />
              )}
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
            {scriptOptions.map((item, index) => (
              <div key={index}>
                <FormItem {...formItemLayout} label={`列表${index + 1}`}>
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator(`name${index}`, {
                        initialValue: scriptOptions[index].name,
                        rules: [
                          {
                            required: true,
                            message: `请输入列表${index + 1}名称`
                          }
                        ]
                      })(<Input placeholder={`请输入列表${index + 1}名称`} />)}
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

                {option
                  ? option[index].map((itemOp, indexOp) => (
                      <FormItem
                        {...formItemLayout}
                        label={`配置${indexOp + 1}`}
                        key={indexOp}
                      >
                        <Row gutter={8}>
                          <Col span={16}>
                            {getFieldDecorator(`option${index}s${indexOp}`, {
                              initialValue: itemOp,
                              rules: [
                                {
                                  required: true,
                                  message: `请输入配置项${indexOp + 1}名称`
                                }
                              ]
                            })(<Input placeholder={`请输入配置项${indexOp + 1}名称`} />)}
                          </Col>
                          <Col span={8}>
                            {indexOp === 0 ? (
                              <Button
                                onClick={this.handleAddOption.bind(this, index)}
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
            ))}

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
        scriptOptions={this.props.scriptOptions}
        option={this.props.option}
        scriptUrl={this.props.scriptUrl}
        gameList={this.props.gameList}
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
