import React from "react";
// import "./user.css";
import { Form, Row, Col, Input, Button, Select,DatePicker  } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class GamesSearchForm extends React.Component {
  constructor(props){
    super()
    this.onChange = this.onChange.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.handelSearch(values)
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
  

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem label="应用ID">
              {getFieldDecorator(`loginAccount`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="应用ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用名称">
              {getFieldDecorator(`loginAccount`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="应用名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="应用类型">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="分类">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="平台">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="创建时间">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <RangePicker onChange={this.onChange} />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="优先级">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="上架状态">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="厂商">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="更新时间">
              {getFieldDecorator(`department`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择部门">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <Button type="primary" htmlType="submit" icon="search">
              搜索
            </Button>
            <Button icon="retweet" style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(GamesSearchForm);

export default WrappedAdvancedSearchForm;
