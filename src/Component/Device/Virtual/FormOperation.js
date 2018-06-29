import React from "react";
import { disabledDate } from "../../../Common";
import { Form, Row, Col, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

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
              <FormItem label="设备操作类型">
                {getFieldDecorator(`operation_type`, {
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(
                  <Select placeholder="请选择设备操作类型">
                    <Option value={1}>用户连接设备</Option>
                    <Option value={2}>用户断开设备</Option>
                    <Option value={3}>管理员连接设备</Option>
                    <Option value={4}>管理员断开设备</Option>
                    <Option value={5}>安装应用</Option>
                    <Option value={6}>卸载应用</Option>
                    <Option value={7}>启动应用</Option>
                    <Option value={8}>停止应用</Option>
                    <Option value={9}>重启设备</Option>
                    <Option value={10}>重置设备</Option>
                    <Option value={11}>升级设备</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="任务开始时间">
                {getFieldDecorator(`created_at`, {
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(
                  <RangePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="任务结束时间">
                {getFieldDecorator(`updated_at`, {
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(
                  <RangePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                  />
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
