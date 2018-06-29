import React from "react";
import { disabledDate } from "../../../Common";
import { Form, Row, Col, Input, Button, DatePicker, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class ScriptSearchForm extends React.Component {
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

  // 改变游戏清空渠道商值
  onChangeGame = id => {
    this.props.form.setFieldsValue({
      channel_name: undefined
    });
    this.props.onChangeGame(id);
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  };

  // 验证任务ID
  IdValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  // 验证应用ID
  AppIdValidate = (rule, value, callback) => {
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
              {getFieldDecorator(`batch_action_id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.IdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入任务ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="任务类型">
              {getFieldDecorator(`type`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择任务类型">
                  <Option value="install">安装应用</Option>
                  <Option value="uninstall">卸载应用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="APP ID">
              {getFieldDecorator(`app_id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.AppIdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入APPID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="游戏名称">
              {getFieldDecorator(`game_name`, {
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
              {getFieldDecorator(`channel_name`, {
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
            <FormItem label="任务结果">
              {getFieldDecorator(`task_status`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择任务结果">
                  <Option value={1}>进行中</Option>
                  <Option value={2}>成功</Option>
                  <Option value={3}>失败</Option>
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

const WrappedAdvancedSearchForm = Form.create()(ScriptSearchForm);

export default WrappedAdvancedSearchForm;
