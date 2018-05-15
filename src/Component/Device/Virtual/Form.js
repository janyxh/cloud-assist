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
            <FormItem label="虚拟机名称">
              {getFieldDecorator(`server_name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入虚拟机名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="设备状态">
              {getFieldDecorator(`server_status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择设备状态">
                  {/* {this.props.dataType.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.appTypeName}
                    </Option>
                  ))} */}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="连接状态">
              {getFieldDecorator(`connect_status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择连接状态">
                  {/* {this.props.dataType.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.appTypeName}
                    </Option>
                  ))} */}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="是否禁用">
              {getFieldDecorator(`is_forbidden`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择是否禁用">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
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
              {getFieldDecorator(`updated_at`, {
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
