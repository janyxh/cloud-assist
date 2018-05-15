import React from "react";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TaskSearchForm extends React.Component {
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
            <FormItem label="任务ID">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  }
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
            <FormItem label="任务状态">
              {getFieldDecorator(`status`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择任务状态">
                  <Option value={1}>任务执行中</Option>
                  <Option value={0}>任务已结束</Option>
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
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="更新时间">
              {getFieldDecorator(`update_at`, {
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

const WrappedAdvancedSearchForm = Form.create()(TaskSearchForm);

export default WrappedAdvancedSearchForm;
