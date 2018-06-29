import React from "react";
import { Form, Icon, Input, Button, Row, Col } from "antd";
const FormItem = Form.Item;

class TestForm extends React.Component {
  state = {
    domains: [
      {
        value: "",
        key: Date.now()
      }
    ]
  };
  removeDomain = item => {
    var index = this.state.domains.indexOf(item);
    const arrRemove = JSON.parse(JSON.stringify(this.state.domains));
    if (index !== -1) {
      arrRemove.splice(index, 1);
    }
    this.setState(
      {
        domains: arrRemove
      },
      () => {
        console.log(this.state.domains);
      }
    );
  };
  addDomain = () => {
    const arrAdd = JSON.parse(JSON.stringify(this.state.domains));
    arrAdd.push({
      value: "",
      key: Date.now()
    });
    this.setState(
      {
        domains: arrAdd
      },
      () => {
        console.log(this.state.domains);
      }
    );
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 }
      }
    };
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {this.state.domains && this.state.domains.length > 0
          ? this.state.domains.map((item, index) => (
              <FormItem
                {...(index > 0 ? formItemLayoutWithOutLabel : formItemLayout)}
                label={index > 0 ? "" : `配置${index + 1}`}
                key={item.key}
              >
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator(`names[${index}]`, {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input passenger's name or delete this field."
                        }
                      ]
                    })(
                        <Input
                          placeholder="passenger name"
                          style={{ width: "60%", marginRight: 8 }}
                        />
                    )}
                  </Col>
                  <Col span={8}>
                    {this.state.domains.length > 1 ? (
                      <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={this.state.domains.length === 1}
                        onClick={() => this.removeDomain(item)}
                      />
                    ) : null}
                  </Col>
                </Row>
              </FormItem>
            ))
          : null}

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.addDomain}>
            Add
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const Test2 = Form.create()(TestForm);
export default Test2;
