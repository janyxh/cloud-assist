import React from "react";
import { disabledDate } from "../../Common";
import { Form, Row, Col, Input, Button, Select, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

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

  // 验证用户ID
  // IdValidate = (rule, value, callback) => {
  //   if (value !== "" && value && !Number.isInteger(Number(value))) {
  //     callback(new Error("请输入整数"));
  //   } else {
  //     callback();
  //   }
  // };

  // 验证申请资金
  capitalValidate = (rule, value, callback) => {
    if (value !== "" && value && isNaN(Number(value))) {
      callback(new Error("请输入数字"));
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
            <FormItem label="平台订单号">
              {getFieldDecorator(`thirdPlatformId`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入平台订单号" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="流水号">
              {getFieldDecorator(`orderId`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入流水号" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="用户ID">
              {getFieldDecorator(`userId`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input maxLength="11" placeholder="请输入用户ID" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="申请资金">
              {getFieldDecorator(`funds`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.capitalValidate }
                ]
              })(<Input maxLength="9" placeholder="请输入申请资金" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="结算状态">
              {getFieldDecorator(`status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择结算状态">
                  <Option value={1}>已完成</Option>
                  <Option value={0}>处理中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="支付渠道">
              {getFieldDecorator(`paymentMode`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择支付渠道">
                  <Option value={1}>支付宝支付</Option>
                  <Option value={2}>微信支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="资金类型">
              {getFieldDecorator(`fundsType`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择资金类型">
                  <Option value={1}>退款</Option>
                  <Option value={2}>推广奖励</Option>
                  <Option value={3}>提现</Option>
                  <Option value={4}>账户加钱</Option>
                  <Option value={5}>账户减钱</Option>
                  <Option value={6}>支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="交易类型">
              {getFieldDecorator(`exchangeType`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择支付渠道">
                  <Option value={1}>挂机点充值</Option>
                  <Option value={0}>无</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="提交方式">
              {getFieldDecorator(`submitType`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择提交方式">
                  <Option value={1}>在线支付 </Option>
                  <Option value={2}>人工确认</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="提交状态">
              {getFieldDecorator(`submitStatus`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select placeholder="请选择提交状态">
                <Option value={0}>待提交 </Option>
                  <Option value={1}>已提交 </Option>
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
            <FormItem label="结束时间">
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

const WrappedAdvancedSearchForm = Form.create()(GamesSearchForm);

export default WrappedAdvancedSearchForm;
