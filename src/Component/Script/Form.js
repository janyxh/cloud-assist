import React from "react";
import { disabledDate } from "../../Common";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
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

  // 验证脚本ID
  scriptIdValidate = (rule, value, callback) => {
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
            <FormItem label="脚本ID">
              {getFieldDecorator(`script_id`, {
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
            <FormItem label="脚本名称">
              {getFieldDecorator(`script_name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入脚本名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="所属游戏">
              {getFieldDecorator(`game_id`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select
                  placeholder="请选择所属游戏"
                  onChange={this.onChangeGame}
                >
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
            <FormItem label="所属渠道商">
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
            <FormItem label="上架状态">
              {getFieldDecorator(`shelf_status`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择上架状态">
                  <Option value={1}>上架</Option>
                  <Option value={0}>下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="好用度">
              {getFieldDecorator(`star_count`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择好用度">
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                  <Option value={5}>5</Option>
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
