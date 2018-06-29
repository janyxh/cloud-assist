import React from "react";
import { Form, Row, Col, Button, Select, Input } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
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

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="设备ID">
                {getFieldDecorator(`server_id`, {
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Input placeholder="请输入设备ID" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="升级进度">
                {getFieldDecorator(`progress`, {
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(
                  <Select placeholder="请选择升级进度">
                    <Option value={0}>未开始</Option>
                    <Option value={1}>收到升级指令</Option>
                    <Option value={2}>下载升级包完成</Option>
                    <Option value={3}>升级成功</Option>
                    <Option value={4}>升级失败</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
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
);

class CollectionsPage extends React.Component {
  // 清除搜索值
  handelClear = () => {
    const form = this.formRef.props.form;
    form.resetFields();
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    return (
      <CollectionCreateForm
        wrappedComponentRef={this.saveFormRef}
        handleReset={this.props.handleReset}
        handelSearch={this.props.handelSearch}
      />
    );
  }
}
export default CollectionsPage;
