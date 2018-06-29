import React from "react";
// import "./user.css";
import { Form, Row, Col, Input, Button } from "antd";
const FormItem = Form.Item;

class AdvancedSearchForm extends React.Component {
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.handelSearch(values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  };

  // 验证手机号
  phoneValidate = (rule, value, callback) => {
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
            <FormItem label="登录名">
              {getFieldDecorator(`loginAccount`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入登录名" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="昵称">
              {getFieldDecorator(`nickName`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="姓名">
              {getFieldDecorator(`realName`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="手机号码">
              {getFieldDecorator(`phoneNumber`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  },
                  { validator: this.phoneValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入手机号码" />)}
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

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

export default WrappedAdvancedSearchForm;
