import React from "react";
// import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { loginOut } from "../api/api";
import Menu from "../Component/Menu";
import { Icon, message } from "antd";

class Left extends React.Component {
  constructor(props) {
    super();
    this.state = {
      nickName: ""
    };
    this.handleSignOut = this.handleSignOut.bind(this);
  }
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired
  // };
  componentDidMount() {
    const userName = sessionStorage.getItem("userName");
    if (userName) {
      this.setState({
        nickName: userName
      });
    }
    // else {
    //   message.error("检测到您未登录，请登录");
    //   this.props.history.push("/");
    // }
  }
  handleSignOut = () => {
    loginOut()
      .then(res => {
        const { code } = res;
        if (code === "00") {
          // data = res.data;
          message.success(res.message);
          sessionStorage.removeItem("userName");
          this.props.history.push("/");
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };
  render() {
    // const { match, location, history } = this.props;
    return (
      <aside>
        <div className="logo">
          <Icon type="cloud-o" style={{ fontSize: 60, color: "#ffffff" }} />
          <h2>云辅助管理系统</h2>
        </div>
        <p>
          <span style={{ color: "#ddd", margin: "0 20px" }}>
            你好，{this.state.nickName}
          </span>

          <a onClick={this.handleSignOut}>
            <Icon type="logout" />&nbsp;退出
          </a>
        </p>
        <Menu />
      </aside>
    );
  }
}

export default withRouter(Left);
