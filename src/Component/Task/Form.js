import React from "react";
import { disabledDate } from "../../Common";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TaskSearchForm extends React.Component {
  state = {
    gameList: []
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.handelSearch(values);
    });
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  };

  // 改变游戏清空渠道商值
  onChangeGame = id => {
    this.props.form.setFieldsValue({
      channel_name: undefined
    });
    this.props.onChangeGame(id);
  };

  // 验证任务ID
  idValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  // 验证脚本ID
  scriptIdValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  // 验证应用ID
  appIdValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem label="任务ID">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.idValidate }
                ]
              })(<Input placeholder="请输入任务ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="任务名称">
              {getFieldDecorator(`name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入任务名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="脚本ID">
              {getFieldDecorator(`scriptId`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.scriptIdValidate }
                ]
              })(<Input placeholder="请输入脚本ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="用户ID">
              {getFieldDecorator(`userId`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入用户ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用ID">
              {getFieldDecorator(`appId`, {
                rules: [
                  {
                    required: false
                  },
                  {
                    validator: this.appIdValidate
                  }
                ]
              })(<Input placeholder="请输入应用ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="游戏名称">
              {getFieldDecorator(`gameName`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择游戏" onChange={this.onChangeGame}>
                  {this.props.gameList && this.props.gameList.length > 0
                    ? this.props.gameList.map(item => (
                        <Option value={item.game_id} key={item.game_id}>
                          {item.game_name}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="渠道名称">
              {getFieldDecorator(`channelName`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择所属渠道商">
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
          </Col>
          <Col span={4}>
            <FormItem label="任务状态">
              {getFieldDecorator(`status`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择任务状态">
                  <Option value={0}>初始化</Option>
                  <Option value={1}>启动脚本app</Option>
                  <Option value={2}>启动游戏app</Option>
                  <Option value={3}>挂机中</Option>
                  <Option value={4}>已结束</Option>
                  <Option value={5}>异常结束</Option>
                  <Option value={6}>任务超时</Option>
                  <Option value={9}>结束中</Option>
                  <Option value={10}>任务启动失败</Option>
                  <Option value={11}>未开始挂机，结束中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="创建时间">
              {getFieldDecorator(`created_at`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="更新时间">
              {getFieldDecorator(`updated_at`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <Button type="primary" htmlType="submit" icon="search">
                搜索
              </Button>
              <Button
                icon="retweet"
                style={{ marginLeft: 8 }}
                onClick={this.handleReset}
              >
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(TaskSearchForm);

export default WrappedAdvancedSearchForm;
