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
    ],
    script_options: [
      {
        name: "eeee",
        option: ["工工", "仍然在", "中是"],
        key: Date.now()
      },
      {
        name: "aaa",
        option: ["bbb", "cccc"],
        key: Date.now() - 1
      }
    ]
  };
  registering = () => {
    this.props.form.setFieldsValue({
      name0: 1
    });
  };
  removeDomain = item => {
    var index = this.state.script_options.indexOf(item);
    const arrRemove = JSON.parse(JSON.stringify(this.state.script_options));
    if (index !== -1) {
      arrRemove.splice(index, 1);
    }
    this.setState(
      {
        script_options: arrRemove
      },
      () => {
        console.log(this.state.script_options);
      }
    );
  };
  addDomain = () => {
    const arrAdd = JSON.parse(JSON.stringify(this.state.script_options));
    arrAdd.push({
      value: "",
      key: Date.now()
    });
    this.setState(
      {
        script_options: arrAdd
      },
      () => {
        console.log(this.state.script_options);
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
    // const { getFieldDecorator } = this.props.form;
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
        {this.state.script_options && this.state.script_options.length > 0
          ? this.state.script_options.map((item, index) => (
              <FormItem
                {...(index > 0 ? formItemLayoutWithOutLabel : formItemLayout)}
                label={index > 0 ? "" : `配置${index + 1}`}
                key={item.key}
              >
                <Row gutter={8}>
                  {/* <Col span={16}>
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
                      // 包入在div里，不会影响value值变化，初始进入时，赋值 setvalue
                      <div>
                        <Input
                          placeholder="passenger name"
                          style={{ width: "60%", marginRight: 8 }}
                          value={item.name}
                        />
                      </div>
                    )}
                  </Col> */}
                  <Col span={16}>
                    <Input
                      placeholder="passenger name"
                      style={{ width: "60%", marginRight: 8 }}
                      defaultValue={item.name}
                    />
                  </Col>
                  <Col span={8}>
                    {item.key}
                    {this.state.script_options.length > 1 ? (
                      <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={this.state.script_options.length === 1}
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
        <FormItem {...formItemLayoutWithOutLabel} />
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
