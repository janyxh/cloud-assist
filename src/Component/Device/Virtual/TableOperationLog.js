import React from "react";
import { Table, message } from "antd";
import moment from "moment";
import { GetTimeOutput, getDurning, handleTimeout } from "../../../Common";
import { operations } from "../../../api/api";
import FormOperation from "./FormOperation";

class OperationLog extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      data: [],
      serverId: "",
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      }
    };
    this.onChange = this.onChange.bind(this);
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = (server_id, params) => {
    handleTimeout(() => {
      this.setState({
        loading: false
      });
    });
    this.setState(
      {
        serverId: server_id,
        loading: true
      },
      () => {
        operations(this.state.serverId, params)
          .then(res => {
            this.setState({ loading: false });
            const { code } = res;
            if (code === "00") {
              if (res.data) {
                this.setState({
                  data: res.data.list,
                  pagination: {
                    total: res.data.total,
                    current: res.data.pageNum
                  }
                });
              }
            } else {
              this.setState({
                loading: false,
                data: [],
                pagination: { total: 0, current: 1 }
              });
              message.error(res.message);
            }
          })
          .catch(e => {
            console.error(e);
          });
      }
    );
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
        this.getList(this.state.serverId, this.state.searchParams);
      }
    );
  };

  // 重置
  handleReset = () => {
    this.setState({
      searchParams: {},
      pagination: {
        total: 0
      }
    });
    this.getList(this.state.serverId, {});
  };

  // ---------------------------------------------  分页   -------------------------------------------------

  // 选择当前第几页
  onChange = page => {
    this.setState(
      {
        pagination: {
          current: page
        },
        searchParams: Object.assign(this.state.searchParams, { page: page }),
        loading: true
      },
      () => {
        this.getList(this.state.serverId, this.state.searchParams);
      }
    );
  };

  // ---------------------------------------------  操作   -------------------------------------------------

  // 清除搜索值
  handelClear = () => {
    this.refs.FormOperation.handelClear();
    this.setState({
      data: [],
      pagination: { total: 0, current: 1 }
    });
  };
  // 关闭弹出框
  onCancel = () => {
    this.props.onCancel();
    this.refs.FormOperation.handelClear();
    this.setState({
      data: []
    });
  };
  render() {
    return (
      <div>
        <FormOperation
          ref="FormOperation"
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          rowKey="operation_log_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
        />
      </div>
    );
  }
}

const columns = [
  {
    title: "序号",
    key: "index",
    render: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: "设备操作类型",
    key: "operation_type",
    render: (text, record, index) => {
      let status = record.operation_type;
      let str;
      if (status === 1) {
        str = "用户连接设备";
      } else if (status === 2) {
        str = "用户断开设备";
      } else if (status === 3) {
        str = "管理员连接设备";
      } else if (status === 4) {
        str = "管理员断开设备";
      } else if (status === 5) {
        str = "安装应用";
      } else if (status === 6) {
        str = "卸载应用";
      } else if (status === 7) {
        str = "启动应用";
      } else if (status === 8) {
        str = "停止应用";
      } else if (status === 9) {
        str = "重启设备";
      } else if (status === 10) {
        str = "重置设备";
      } else if (status === 11) {
        str = "升级设备";
      } else {
        str = "";
      }
      return str;
    }
  },
  {
    title: "任务开始时间",
    dataIndex: "created_at",
    key: "created_at",
    render: (text, record, index) => {
      let time = GetTimeOutput(record.created_at);
      time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      return time;
    }
  },
  {
    title: "任务结束时间",
    dataIndex: "updated_at",
    key: "updated_at",
    render: (text, record, index) => {
      let time = GetTimeOutput(record.updated_at);
      time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      return time;
    }
  }
];

export default OperationLog;
