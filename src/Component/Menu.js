import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import { getMenu } from "../api/api";
const SubMenu = Menu.SubMenu;

class Nav extends React.Component {
  constructor(props) {
    super();
    this.getDate = this.getDate.bind(this);
    this.state = {
      data: []
    };
  }
  // state = {
  //   collapsed: false
  // };
  // toggleCollapsed = () => {
  //   this.setState({
  //     collapsed: !this.state.collapsed
  //   });
  // };
  getDate = () => {
    const regParams = {};
    getMenu(regParams)
      .then(res => {
        this.setState({
          data: res
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  componentDidMount() {
    this.getDate();
  }
  render() {
    return (
      <div>
        {/* <Button
          type="primary"
          onClick={this.toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          <Icon type={this.state.collapsed ? "menu-unfold" : "menu-fold"} />
        </Button> */}
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          // inlineCollapsed={this.state.collapsed}
        >
          {this.state.data.map(
            (item, index) =>
              item.single ? (
                <Menu.Item key={index}>
                  <Link to={item.path}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Link>}
                </Menu.Item>
              ) : (
                <SubMenu
                  key={index}
                  title={
                    <span>
                      <Icon type={item.icon} />
                      <span>{item.name}</span>
                    </span>
                  }
                >
                  {item.sub.map((item, subIndex) => (
                    <Menu.Item key={index.toString() + subIndex}>
                      <Link to={item.path}>{item.name}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              )
          )}
        </Menu>
      </div>
    );
  }
}

export default Nav;
