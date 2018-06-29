import React from "react";
import { disabledDate } from "../../../Common";
import { Form, Row, Col, Input, Button, DatePicker } from "antd";
const FormItem = Form.Item;
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
            <FormItem label="镜像ID">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.goodsIdValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入镜像ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="镜像名称">
              {getFieldDecorator(`imageName`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入镜像名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="安卓版本号">
              {getFieldDecorator(`androidVersion`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入安卓版本号" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="内部版本号">
              {getFieldDecorator(`maintainVersion`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入内部版本号" />)}
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
