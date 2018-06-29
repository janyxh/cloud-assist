import React from "react";
import { disabledDate } from "../../../Common";
import { Form, Row, Col, Input, Button, DatePicker, Select } from "antd";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

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

  // 验证镜像ID
  goodsIdValidate = (rule, value, callback) => {
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
              {getFieldDecorator(`upgrade_id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.goodsIdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入任务ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="内部版本号">
              {getFieldDecorator(`version`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入版本" />)}
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
