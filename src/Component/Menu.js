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
    this.handlePath = this.handlePath.bind(this);
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
        this.setState(
          {
            data: res
          },
          () => {
            this.handlePath(res);
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  };
  componentWillMount() {
    this.getDate();
  }

  handleClick = ({ item, key, keyPath }) => {
    sessionStorage.setItem("SelectedKeys", key);
    keyPath[1]
      ? sessionStorage.setItem("OpenKeys", keyPath[1])
      : sessionStorage.setItem("OpenKeys", "");
  };

  // 查询路径
  handlePath = data => {
    let path = window.location.pathname;
    for (let i = 0; i < data.length; i++) {
      let sub = data[i].sub;
      if (data[i].path === path) {
        this.setState({
          defaultSelectedKeys: `key${i}`
        });
        break;
      } else if (sub) {
        for (let j = 0; j < sub.length; j++) {
          if (sub[j].path === path) {
            this.setState({
              defaultSelectedKeys: `key${i}${j}`,
              defaultOpenKeys: `sub${i}`
            });
            break;
          }
        }
      }
    }
  };
  render() {
    const SelectedKeys = sessionStorage.getItem("SelectedKeys");
    const OpenKeys = sessionStorage.getItem("OpenKeys");
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
          defaultSelectedKeys={[SelectedKeys]}
          defaultOpenKeys={[OpenKeys]}
          mode="inline"
          theme="dark"
          // inlineCollapsed={this.state.collapsed}
          onClick={this.handleClick}
        >
          {this.state.data && this.state.data.length > 0
            ? this.state.data.map(
                (item, index) =>
                  item.single ? (
                    <Menu.Item key={`key${index}`}>
                      <Link to={item.path}>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                      </Link>}
                    </Menu.Item>
                  ) : (
                    <SubMenu
                      key={`sub${index}`}
                      title={
                        <span>
                          <Icon type={item.icon} />
                          <span>{item.name}</span>
                        </span>
                      }
                    >
                      {item.sub && item.sub.length > 0
                        ? item.sub.map((item, subIndex) => (
                            <Menu.Item
                              key={`key${index.toString() + subIndex}`}
                            >
                              <Link to={item.path}>{item.name}</Link>
                            </Menu.Item>
                          ))
                        : null}
                    </SubMenu>
                  )
              )
            : null}
        </Menu>
      </div>
    );
  }
}

export default Nav;
