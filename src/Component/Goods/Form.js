import React from "react";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class ScriptSearchForm extends React.Component {
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
            <FormItem label="商品ID">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input type="number" placeholder="请输入商品ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品名称">
              {getFieldDecorator(`name`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入商品名称" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品类型">
              {getFieldDecorator(`goodsType`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择商品类型">
                  <Option value={2}>挂机点</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品规格">
              {getFieldDecorator(`amount`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input type="number" placeholder="请输入商品规格" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="上架状态">
              {getFieldDecorator(`status`, {
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
            <FormItem label="页头标">
              {getFieldDecorator(`pageFlag`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Select placeholder="请选择页头标">
                  <Option value={1}>有</Option>
                  <Option value={0}>无</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col span={6}>
            <FormItem label="商品价格">
              {getFieldDecorator(`price`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col> */}
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

const WrappedAdvancedSearchForm = Form.create()(ScriptSearchForm);

export default WrappedAdvancedSearchForm;
