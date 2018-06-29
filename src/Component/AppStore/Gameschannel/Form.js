import React from "react";
import { disabledDate } from "../../../Common";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class GamesSearchForm extends React.Component {
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

  // 验证应用ID
  gameIdValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  // 验证APP ID
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
            <FormItem label="APPID">
              {getFieldDecorator(`app_id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.appIdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入APPID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用ID">
              {getFieldDecorator(`game_id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.gameIdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入应用ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用名称">
              {getFieldDecorator(`game_name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入应用名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="渠道商">
              {getFieldDecorator(`channel_name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入渠道商" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="ROOT权限">
              {getFieldDecorator(`is_root`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择ROOT权限">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="厂商">
              {getFieldDecorator(`vendor`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入厂商" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用类型">
              {getFieldDecorator(`app_big_type`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select
                  placeholder="请选择应用类型"
                  onChange={this.props.onChangeDataType}
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
          </Col>
          <Col span={4}>
            <FormItem label="分类">
              {getFieldDecorator(`app_small_type`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
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
          </Col>
          <Col span={4}>
            <FormItem label="上架状态">
              {getFieldDecorator(`shelf_status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
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
            <FormItem label="展示状态">
              {getFieldDecorator(`channel_show`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择上架状态">
                  <Option value={1}>展示</Option>
                  <Option value={0}>隐藏</Option>
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

const WrappedAdvancedSearchForm = Form.create()(GamesSearchForm);

export default WrappedAdvancedSearchForm;
