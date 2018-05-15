import React from "react";
// import "./user.css";
import { Form, Row, Col, Input, Button, DatePicker } from "antd";
const FormItem = Form.Item;
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
            <FormItem label="用户ID">
              {getFieldDecorator(`user_id`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input type="number" placeholder="请输入用户ID" />)}
            </FormItem>
          </Col>
          {/* <Col span={4}>
            <FormItem label="昵称">
              {getFieldDecorator(`name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="手机号">
              {getFieldDecorator(`phone`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Input type="number" maxLength="11" placeholder="请输入手机号" />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="微信">
              {getFieldDecorator(`wechat`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Input placeholder="请输入微信" />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="QQ">
              {getFieldDecorator(`qq`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Input type="number" placeholder="请输入QQ" />
              )}
            </FormItem>
          </Col> */}
          <Col span={6}>
            <FormItem label="注册时间">
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
