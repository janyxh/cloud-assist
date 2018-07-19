import React from "react";
import VirtualForm from "../../../Component/Device/Virtual/Form";
import OperationsTable from "../../../Component/Device/Virtual/Operation";
import DetailTable from "../../../Component/Device/Virtual/TableDetail";
import ServerEdit from "../../../Component/Device/Virtual/Edit";
// import Server from "../../../Component/Device/Virtual/Server";
import { Table, message, Button, Popconfirm, Affix } from "antd";
import { servers, serversAction, editServers } from "../../../api/api";
import moment from "moment";
import {
  getDurning,
  GetTimeOutput,
  handleTimeout,
  handleTableWidth
} from "../../../Common";

class Games extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      tableScroll: handleTableWidth(1366, 1900), // 表格宽度
      selectedRowKeys: [],
      data: [],
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      visible: false, //查看设备操作日志
      confirmLoading: false,
      values: {},
      visibleDetail: false, // 隐藏  查看
      serverId: "", // id  查看
      // visibleServer: false,
      visibleEdit: false // 编辑
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getList = this.getList.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getList({});
    window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.setState({
      tableScroll: handleTableWidth(1366, 1900)
    });
  };

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = (params, fn) => {
    handleTimeout(() => {
      this.setState({ loading: false });
    });
    servers(params)
      .then(res => {
        this.setState({
          loading: false,
          data: [],
          pagination: { total: 0, current: 1 }
        });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState(
              {
                data: res.data.list,
                pagination: { total: res.data.total, current: res.data.pageNum }
              },
              () => {
                fn && fn();
              }
            );
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

  // 搜索
  handelSearch = params => {
    this.setState({ loading: true });
    delete this.state.searchParams.page;
    const gameParams = params;

    // 转换时间格式
    getDurning(gameParams, "created_at", "created_from", "created_to");
    getDurning(gameParams, "updated_at", "updated_from", "updated_to");

    this.setState(
      {
        searchParams: gameParams
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
      selectedRowKeys: [],
      loading: true
    });

    this.getList(this.state.searchParams);
  };

  // ---------------------------------------------  操作   -------------------------------------------------

  // 选中表格
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 重启重置
  handleAction = type => {
    const hasdocumentElement =
      document.documentElement && document.documentElement.scrollTop;
    const top = hasdocumentElement
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
    // console.log("top", top);
    // console.log(this.state.selectedRowKeys);
    if (this.state.selectedRowKeys.length === 0) {
      message.warning("请选择一台设备");
      return false;
    } else if (this.state.selectedRowKeys.length > 1) {
      message.warning("请选择一台设备");
      return false;
    }
    const params = {
      type: type
    };
    let paramsRest = Object.assign(
      this.state.searchParams,
      this.state.pagination.current
    );
    // console.log(this.state.searchParams);
    // console.log(this.state.pagination.current);
    // this.getList(paramsRest);
    serversAction(this.state.selectedRowKeys, params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          message.success(res.message);
          this.getList(paramsRest, () => {
            if (hasdocumentElement) {
              document.documentElement.scrollTop = top;
            } else {
              document.body.scrollTop = top;
            }
          });
          this.setState({
            selectedRowKeys: []
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
    handleTimeout(() => {
      this.setState({
        selectedRowKeys: []
      });
    });
  };

  // 查看设备操作日志
  handleLog = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning("请选择一台设备");
      return false;
    } else if (this.state.selectedRowKeys.length > 1) {
      message.warning("请选择一台设备");
      return false;
    }
    this.refs.OperationsTable.handleGetlist(this.state.selectedRowKeys[0]);
    this.showModal();
  };

  // 解除设备锁定
  handleUnlock = record => {
    const params = {
      server_status: 1
    };
    let paramsRest = Object.assign(
      this.state.searchParams,
      this.state.pagination.current
    );
    editServers(record.server_id, params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          message.success(res.message);
          this.getList(paramsRest);
        } else {
          message.error(res.message);
        }
      })
      .catch();
  };

  // ---------------------------------------------  查看设备操作日志   -------------------------------------------------

  // 打开弹出框
  showModal = () => {
    this.setState(
      {
        visible: true
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
  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  // 点击弹出框的取消
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: []
    });
  };

  // ---------------------------------------------  查看设备信息   -------------------------------------------------

  // 查看设备信息
  handleDetail = server_id => {
    this.setState(
      {
        serverId: server_id,
        visibleDetail: true
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
    this.refs.DetailTable.getList(server_id);
  };

  // 点击弹出框的关闭
  handleCancelDetail = () => {
    this.setState({
      visibleDetail: false
    });
  };
  // // ---------------------------------------------  编辑云手机   -------------------------------------------------

  // // 编辑云手机
  // handleEdit = values => {
  //   this.setState(
  //     {
  //       values: values,
  //       visibleEdit: true
  //     },
  //     () => {
  //       if (
  //         document.querySelectorAll(".ant-modal-body") &&
  //         document.querySelectorAll(".ant-modal-body").length > 0
  //       ) {
  //         setTimeout(() => {
  //           document.querySelectorAll(".ant-modal-body").forEach(element => {
  //             element.scrollTop = 0;
  //           });
  //         }, 50);
  //       }
  //     }
  //   );
  // };

  // // 点击弹出框的关闭
  // handleCancel = () => {
  //   this.setState({
  //     visibleEdit: false
  //   });
  // };

  // // 点击弹出框的确定
  // handleOk = (values, fn) => {
  //   delete this.state.searchParams.page;
  //   this.setState({
  //     confirmLoading: true
  //   });

  //   let params = {
  //     server_name: values.server_name,
  //     server_status: values.server_status,
  //     is_forbidden: values.is_forbidden
  //   };
  //   const server_id = this.state.values.server_id;
  //   editServers(server_id, params)
  //     .then(res => {
  //       const { code } = res;
  //       if (code === "00") {
  //         this.setState({
  //           visibleEdit: false,
  //           confirmLoading: false,
  //           values: {}
  //         });
  //         message.success(res.message);
  //         this.getList(this.state.searchParams);
  //       } else {
  //         message.error(res.message);
  //         this.setState({
  //           confirmLoading: false
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // };

  // ---------------------------------------------  连接云手机   -------------------------------------------------

  // // 连接云手机
  // handleConnect = server_id => {
  //   console.log(server_id);
  //   console.log("连接");
  //   this.setState({
  //     serverId: server_id,
  //     visibleServer: true
  //   });
  //   this.refs.Server.handleConnect(server_id);
  // };

  // // 点击弹出框的关闭
  // handleCancelServer = () => {
  //   this.setState({
  //     visibleServer: false
  //   });
  // };

  render() {
    const columns = [
      {
        title: "序号",
        key: "index",
        // width: 80,
        // fixed: "left",
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "云手机ID",
        dataIndex: "server_id",
        key: "server_id"
        // width: 160
        // fixed: "left"
      },
      {
        title: "云手机名字",
        dataIndex: "server_name",
        key: "server_name"
        // width: 100
      },
      {
        title: "云手机设备状态",
        key: "server_status",
        // width: 100,
        render: (text, record) => {
          let status = record.server_status;
          let str;
          if (status === 0) {
            str = "未知状态";
          } else if (status === 1) {
            str = "正常运行";
          } else if (status === 2) {
            str = "锁定";
          } else {
            str = "";
          }
          return str;
        }
      },
      {
        title: "云手机占用状态",
        key: "occupy_status",
        // width: 100,
        render: (text, record) => {
          let status = record.occupy_status;
          let str;
          if (status === 1) {
            str = "未占用";
          } else if (status === 2) {
            str = "用户";
          } else if (status === 3) {
            str = "管理员";
          } else if (status === 4) {
            str = "管理员/用户";
          } else if (status === 5) {
            str = "管理员/用户";
          } else {
            str = "";
          }
          return str;
        }
      },
      {
        title: "云手机连接状态",
        key: "connect_status",
        // width: 100,
        render: (text, record) => {
          let status = record.connect_status;
          let str;
          if (status === 1) {
            str = "未连接";
          } else if (status === 2) {
            str = "用户";
          } else if (status === 3) {
            str = "管理员";
          } else if (status === 4) {
            str = "管理员/用户";
          } else if (status === 5) {
            str = "任务连接";
          } else {
            str = "";
          }
          return str;
        }
      },
      {
        title: "用户ID",
        dataIndex: "user_id",
        key: "user_id"
        // width: 100
      },
      {
        title: "内网IP",
        dataIndex: "local_ip",
        key: "local_ip"
        // width: 100
      },
      {
        title: "外网IP",
        dataIndex: "remote_desktop_ip",
        key: "remote_desktop_ip"
        // width: 100
      },
      {
        title: "端口",
        key: "remote_desktop_port",
        // width: 200,
        render: (text, record) => {
          let str = "";
          const arrPort = record.remote_desktop_port;
          if (arrPort && arrPort.length > 0) {
            if (arrPort && arrPort.length > 0) {
              arrPort.forEach((item, index) => {
                str !== "" ? (str += `,${item}`) : (str += item);
              });
            }
          }
          return str;
        }
      },
      {
        title: "客户端数目",
        dataIndex: "remote_client_count",
        key: "remote_client_count"
        // width: 100
      },
      {
        title: "安卓版本号",
        dataIndex: "android_version",
        key: "android_version"
        // width: 100
      },
      {
        title: "内部版本号",
        dataIndex: "version",
        key: "version"
        // width: 100
      },
      {
        title: "是否禁用",
        key: "is_forbidden",
        // width: 80,
        render: (text, record, index) => {
          return record.is_forbidden ? "是" : "否";
        }
      },
      {
        title: "创建时间",
        key: "created_at",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.created_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updated_at",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updated_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "操作",
        key: "action",
        width: 110,
        fixed: document.body.clientWidth <= 1366 ? "right" : "",
        render: (text, record, index) => {
          return (
            <div className="action">
              <a onClick={this.handleDetail.bind(this, record.server_id)}>
                查看
              </a>
              {/* <a onClick={this.handleEdit.bind(this, record)}>编辑</a> */}
              {/* <a onClick={this.handleConnect.bind(this, record.server_id)}>
                连接
              </a> */}
              {record.server_status === 2 ? (
                <Popconfirm
                  title="确定要解锁吗？"
                  okText="是"
                  cancelText="否"
                  onConfirm={this.handleUnlock.bind(this, record)}
                >
                  <a>解锁</a>
                </Popconfirm>
              ) : null}
            </div>
          );
        }
      }
    ];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <h1>云手机管理</h1>
        <hr />
        <Affix offsetTop={0}>
          <div
            className="btns-operation"
            style={{ background: "#f1f1f1", width: "100%" }}
          >
            <Button onClick={this.handleAction.bind(this, "reboot")}>
              重启手机
            </Button>
            <Button onClick={this.handleAction.bind(this, "reset")}>
              重置手机
            </Button>
            <Button onClick={this.handleLog}>查看设备操作日志</Button>
          </div>
        </Affix>
        <VirtualForm
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="server_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
          rowSelection={rowSelection}
          scroll={this.state.tableScroll}
        />
        <OperationsTable
          ref="OperationsTable"
          visible={this.state.visible}
          selectedRowKeys={this.state.selectedRowKeys}
          onCancel={this.handleCancel}
        />
        <DetailTable
          ref="DetailTable"
          visible={this.state.visibleDetail}
          serverId={this.state.serverId}
          onCancel={this.handleCancelDetail}
        />
        <ServerEdit
          visible={this.state.visibleEdit}
          confirmLoading={this.state.confirmLoading}
          values={this.state.values}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        {/* <Server
          ref="Server"
          visible={this.state.visibleServer}
          serverId={this.state.serverId}
          handleCancel={this.handleCancelServer}
        /> */}
      </div>
    );
  }
}

export default Games;
