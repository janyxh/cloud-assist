import React from "react";
import UserForm from "../../../Component/Auth/User/Form";
import UserAdd from "../../../Component/Auth/User/Add";
import PasswordEdit from "../../../Component/Auth/User/PasswordEdit";
import { Button, Table, message, Popconfirm } from "antd";
import {
  getUserList,
  addCloudUser,
  modifyCloudUser,
  deleteCloudUser,
  modifyPassword
} from "../../../api/api";
import { getDurning } from "../../../Common";

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      data: [],
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      visible: false, // 新增编辑弹出框 显示隐藏
      confirmLoading: false, // 新增编辑弹出框 点击确定按钮时加载禁用状态
      isEdit: false, // 新增编辑弹出框 判断是新增还是编辑
      values: {}, // 新增编辑弹出框 编辑时传入的参数
      visiblePasswordEdit: false // 修改密码 显示隐藏
    };
    this.getList = this.getList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getList({});
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    getUserList(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: { total: res.data.total, current: res.data.pageNum }
            });
          } else {
            this.setState({
              data: [],
              pagination: { total: 0, current: 1 }
            });
          }
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  // ---------------------------------------------  搜索   -------------------------------------------------

  handelSearch = params => {
    delete this.state.searchParams.page;
    const gameParams = params;
    // 转换时间格式
    getDurning(gameParams, "created_at", "createdAtStart", "createdAtEnd");
    getDurning(gameParams, "updated_at", "updatedAtStart", "updatedAtEnd");

    this.setState(
      {
        searchParams: gameParams,
        loading: true
      },
      () => {
        this.getList(this.state.searchParams);
      }
    );
  };

  // 重置
  handleReset = () => {
    this.setState({
      searchParams: {},
      loading: true
    });
    this.getList({});
  };

  // ---------------------------------------------  分页   -------------------------------------------------

  // 选择当前第几页
  onChange = page => {
    this.setState({
      pagination: {
        current: page
      },
      searchParams: Object.assign(this.state.searchParams, { page: page }),
      loading: true
    });

    this.getList(this.state.searchParams);
  };

  // ---------------------------------------------  新增编辑弹出框   -------------------------------------------------

  // 打开弹出框
  showModal = () => {
    this.setState(
      {
        isEdit: false,
        visible: true,
        values: {}
      },
      () => {
        if (
          document.querySelectorAll(".ant-modal-body") &&
          document.querySelectorAll(".ant-modal-body").length > 0
        ) {
          setTimeout(() => {
            document.querySelectorAll(".ant-modal-body").forEach(element => {
              element.scrollTop = 0;
            });
          }, 50);
        }
      }
    );
  };

  // 编辑
  handleEdit = values => {
    this.setState(
      {
        isEdit: true,
        visible: true,
        values: Object.assign(this.state.values, values)
      },
      () => {
        if (
          document.querySelectorAll(".ant-modal-body") &&
          document.querySelectorAll(".ant-modal-body").length > 0
        ) {
          setTimeout(() => {
            document.querySelectorAll(".ant-modal-body").forEach(element => {
              element.scrollTop = 0;
            });
          }, 50);
        }
      }
    );
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    delete this.state.searchParams.page;
    this.setState({
      confirmLoading: true
    });

    const params = values;

    if (!isEdit) {
      addCloudUser(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              values: {}
            });
            message.success(res.message);
            this.getList(this.state.searchParams);
          } else {
            message.error(res.message);
            this.setState({
              confirmLoading: false
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      params.id = this.state.values.id;
      modifyCloudUser(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState(
              {
                visible: false,
                confirmLoading: false
              },
              () => {
                fn && fn();
              }
            );
            // setTimeout(() => {
            //   this.setState({
            //     values: {}
            //   });
            // }, 50);

            message.success(res.message);
            this.getList(this.state.searchParams);
            fn && fn();
          } else {
            message.error(res.message);
            this.setState({
              confirmLoading: false
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  // 关闭弹出框
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // ---------------------------------------------  操作   -------------------------------------------------

  // 修改密码
  handleEditPassword = values => {
    this.setState(
      {
        isEdit: true,
        visiblePasswordEdit: true,
        values: Object.assign(this.state.values, values)
      },
      () => {
        if (
          document.querySelectorAll(".ant-modal-body") &&
          document.querySelectorAll(".ant-modal-body").length > 0
        ) {
          setTimeout(() => {
            document.querySelectorAll(".ant-modal-body").forEach(element => {
              element.scrollTop = 0;
            });
          }, 50);
        }
      }
    );
  };

  // 关闭弹出框
  handleOkPasswordEdit = values => {
    delete this.state.searchParams.page;
    this.setState({
      confirmLoadingPasswordEdit: true
    });

    const params = values;
    params.loginAccount = this.state.values.loginAccount;
    modifyPassword(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          this.setState({
            visible: false,
            confirmLoadingPasswordEdit: false,
            values: {}
          });
          message.success(res.message);
          this.props.history.push("/");
        } else {
          message.error(res.message);
          this.setState({
            confirmLoadingPasswordEdit: false
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  // 关闭弹出框
  handleCancelPasswordEdit = () => {
    this.setState({
      visiblePasswordEdit: false
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------
  // 删除
  confirm = id => {
    delete this.state.searchParams.page;
    const params = {
      id: id
    };
    deleteCloudUser(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          message.success(res.message);
          this.getList(this.state.searchParams);
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  render() {
    const columns = [
      {
        title: "登录账号",
        dataIndex: "loginAccount",
        key: "loginAccount"
      },
      {
        title: "昵称",
        dataIndex: "nickName",
        key: "nickName"
      },
      {
        title: "姓名",
        dataIndex: "realName",
        key: "realName"
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",
        render: (text, record) => {
          return Number(record.sex) ? "男" : "女";
        }
      },
      {
        title: "QQ",
        dataIndex: "qq",
        key: "qq"
      },
      {
        title: "微信",
        dataIndex: "weiXin",
        key: "weiXin"
      },
      {
        title: "手机号",
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        title: "部门",
        dataIndex: "department",
        key: "department"
      },
      {
        title: "操作",
        key: "action",
        width: 140,
        render: (text, record) => {
          return (
            <div className="action">
              <a onClick={this.handleEditPassword.bind(this, record)}>
                修改密码
              </a>
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
              <br />
              <Popconfirm
                title="你确定要删除吗"
                onConfirm={this.confirm.bind(this, record.id)}
                okText="是"
                cancelText="否"
              >
                <a className="danger">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <h1>用户管理</h1>
        <hr />

        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <UserForm
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
        />
        <UserAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        <PasswordEdit
          visible={this.state.visiblePasswordEdit}
          confirmLoading={this.state.confirmLoadingPasswordEdit}
          values={this.state.values}
          handleOk={this.handleOkPasswordEdit}
          handleCancel={this.handleCancelPasswordEdit}
        />
      </div>
    );
  }
}

export default Task;
