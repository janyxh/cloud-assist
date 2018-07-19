import React from "react";
import "./index.css";
import { withRouter } from "react-router-dom";
import { checkLogin } from "../../api/api";
// import { setCookie } from "../../Common";

import { Form, Icon, Input, Button, message } from "antd";
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  componentWillMount() {
    document.onkeyup = event => {
      var e = event || window.event;
      if (e && e.keyCode === 13) {
        //回车键的键值为13
        this.handleSubmit(e); //调用登录按钮的登录事件
      }
    };
  }

  // 登录
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        checkLogin(values)
          .then(res => {
            const { code } = res;
            if (code === "00") {
              message.success(res.message);
              // this.props.history.push("/virtual"+ encodeURIComponent(res.result.cloudUserVO.nickName));
              // const location = {
              //   pathname: '/virtual',
              //   nickName: res.data.cloudUserVO.nickName
              //   }
              sessionStorage.setItem("userName", res.data.cloudUserVO.nickName);
              // sessionStorage.setItem("loginAccount", res.data.cloudUserVO.loginAccount);
              sessionStorage.setItem("SelectedKeys", `key${0}`);
              sessionStorage.setItem("OpenKeys", "");
              // setCookie("JSESSIONID", "CFB721191A48E1357C10C30D917A77C0");
              // setCookie(
              //   "_cloud",
              //   "hE8lamKueWF0Woj-8tQ4TvaPwaMxdhCj8JXpRfBEBodCU7XwBshB5Q"
              // );
              // setTimeout(() => {
              this.props.history.push("/virtual");
              // }, 1000);
            } else {
              message.error(res.message);
            }
          })
          .catch(e => {
            console.error(e);
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="components-form-demo-normal-login">
        <p className="logo">
          <Icon type="cloud-o" style={{ fontSize: 48, color: "#1890ff" }} />
          <span>云辅助管理系统</span>
        </p>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator("loginAccount", {
              rules: [{ required: true, message: "请输入用户名" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <FormItem>
            {/* {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)} */}
            {/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            {/* Or <a href="">register now!</a> */}
          </FormItem>
        </Form>
        <div className="footer">云辅助后台系统 V1.1.00</div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default withRouter(WrappedNormalLoginForm);
