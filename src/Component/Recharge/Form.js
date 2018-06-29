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
      console.log(values);
      if (values.minPrice) {
        values.minPrice = Number(values.minPrice).toFixed(2) * 1000000 / 10000;
      }
      if (values.maxPrice) {
        values.maxPrice = Number(values.maxPrice).toFixed(2) * 1000000 / 10000;
      }
      this.props.handelSearch(values);
      // this.props.form.setFieldsValue({
      //   minPrice: undefined
      // });
      // this.props.form.setFieldsValue({
      //   maxPrice: undefined
      // });
    });
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
    // this.props.form.setFieldsValue({
    //   minPrice: undefined
    // });
    // this.props.form.setFieldsValue({
    //   maxPrice: undefined
    // });
  };

  // 验证商品规格
  amountValidate = (rule, value, callback) => {
    if (value !== "" && value && !Number.isInteger(Number(value))) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  };

  // 验证最低价格
  minPriceValidate = (rule, value, callback) => {
    if (value !== "" && value && isNaN(Number(value))) {
      callback(new Error("请输入数字"));
    } else {
      if (value) {
        let str = value;
        let strNum = value.indexOf(".");
        if (strNum >= 0) {
          str = str.slice(strNum + 1, str.length);
          if (str.length > 2) {
            callback(new Error("小数点后大于两位"));
            return false;
          }
        }
      }
      const maxPrice = Number(this.props.form.getFieldValue("maxPrice"));
      if (maxPrice && value > maxPrice) {
        this.props.form.setFields({
          maxPrice: {
            value: maxPrice.toString(),
            Error: []
          }
        });
        callback(new Error("大于最高价格"));
      } else {
        callback();
      }
    }
  };

  // 验证最高价格
  maxPriceValidate = (rule, value, callback) => {
    if (value !== "" && value && isNaN(Number(value))) {
      callback(new Error("请输入数字"));
    } else {
      if (value) {
        let str = value;
        let strNum = value.indexOf(".");
        if (strNum >= 0) {
          str = str.slice(strNum + 1, str.length);
          if (str.length > 2) {
            callback(new Error("小数点后大于两位"));
            return false;
          }
        }
      }
      const minPrice = Number(this.props.form.getFieldValue("minPrice"));
      if (minPrice && value < minPrice) {
        this.props.form.setFields({
          minPrice: {
            value: minPrice.toString(),
            Error: []
          }
        });
        callback(new Error("小于最低价格"));
      } else {
        callback();
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem label="充值单号">
              {getFieldDecorator(`id`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input placeholder="请输入充值单号" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品类型">
              {getFieldDecorator(`goodsType`, {
                rules: [
                  {
                    required: false
                  }
                  // { validator: this.rechargeValidate }
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
                  },
                  { validator: this.amountValidate }
                ]
              })(<Input maxLength="9" placeholder="请输入商品规格" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品价格">
              {getFieldDecorator(`minPrice`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.minPriceValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入最低价格" />)}
            </FormItem>
          </Col>
          <Col span={3} style={{ position: "relative" }}>
            <span
              style={{ lineHeight: "32px", position: "absolute", left: "-3px" }}
            >
              -
            </span>
            <FormItem>
              {getFieldDecorator(`maxPrice`, {
                rules: [
                  {
                    required: false
                  },
                  { validator: this.maxPriceValidate }
                ]
              })(<Input maxLength="11" placeholder="请输入最高价格" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="订单状态">
              {getFieldDecorator(`status`, {
                rules: [
                  {
                    required: false,
                    message: "Input something!"
                  }
                ]
              })(
                <Select
                  placeholder="请选择订单状态"
                  onChange={this.props.onChangeDataType}
                >
                  <Option value={0}>未付款</Option>
                  <Option value={1}>已付款</Option>
                  <Option value={2}>失败</Option>
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
          <Col span={6}>
            <FormItem label="创建时间">
              {getFieldDecorator(`createdAt`, {
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
              {getFieldDecorator(`updatedAt`, {
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
