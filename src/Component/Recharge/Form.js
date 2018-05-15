import React from "react";
// import "./user.css";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class GamesSearchForm extends React.Component {
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.handelSearch(values);
    });
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem label="充值单号">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input type="number" placeholder="请输入充值单号" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="订单状态">
              {getFieldDecorator(`status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select
                  placeholder="请选择订单状态"
                  onChange={this.props.onChangeDataType}
                >
                  <Option value={1}>已付款</Option>
                  <Option value={2}>已完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="支付渠道">
              {getFieldDecorator(`paymentMode`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择支付渠道">
                  <Option value={1}>支付宝支付</Option>
                  <Option value={2}>微信支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="创建时间">
              {getFieldDecorator(`createdAt`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="更新时间">
              {getFieldDecorator(`updatedAt`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={4}>
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
