import React from "react";
import FormInstallDetail from "./FormInstallDetail";
import { batchActionDetail } from "../../../api/api";
import moment from "moment";
import { GetTimeOutput } from "../../../Common";
import { Table, message } from "antd";

class TableDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      apps: [],
      batch_action_id: "",
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      searchParams: {},
      loading: true //表格loading
    };
  }
  // ---------------------------------------------  获取列表   -------------------------------------------------

  //  查询安装卸载详情列表
  getList = (id, params) => {
    this.setState({ batch_action_id: id, loading: true });
    batchActionDetail(id, params)
      .then(res => {
        this.setState({
          loading: false
        });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState(
              {
                apps: res.data,
                pagination: { total: res.data.length }
              },
              () => {
                this.getData(1);
              }
            );
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

  // 搜索
  handelSearch = params => {
    delete this.state.searchParams.page;
    const gameParams = params;

    this.setState(
      {
        searchParams: gameParams,
        loading: true
      },
      () => {
        this.getList(this.state.batch_action_id, this.state.searchParams);
      }
    );
  };

  // 重置
  handleReset = () => {
    this.setState({
      searchParams: {},
      loading: true,
      apps: []
    });
    this.getList(this.state.batch_action_id, {});
  };

  // 关闭弹出框，清空值
  handelClear = () => {
    this.refs.FormInstallDetail.handelClear();
    this.setState({
      data: [],
      pagination: { total: 0, current: 1 }
    });
  };

  // ---------------------------------------------  分页   -------------------------------------------------

  // 根据页数获取apps数组里的数据
  getData = page => {
    const data = [];
    const { apps } = this.state;
    for (let i = 0; i < 10; i++) {
      let j = (page - 1) * 10 + i;
      let datai = apps[j];
      if (!datai) {
        break;
      }
      data.push(datai);
    }
    this.setState({ data: data, loading: false });
  };

  // 选择当前第几页
  onChange = page => {
    this.setState({
      pagination: {
        current: page
      },
      searchParams: Object.assign(this.state.searchParams, { page: page }),
      loading: true
    });
    this.getData(page);
  };

  render() {
    const { loading, rowSelection, data, pagination } = this.state;
    return (
      <div>
        <FormInstallDetail
          ref="FormInstallDetail"
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          rowKey="batch_action_detail_id"
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={pagination}
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
    title: "设备ID",
    dataIndex: "server_id",
    key: "server_id"
  },
  {
    title: "内网IP",
    dataIndex: "local_ip",
    key: "local_ip"
  },
  {
    title: "任务类型",
    dataIndex: "type",
    key: "type",
    render: (text, record) => {
      if (record.type === "install") {
        return "安装应用";
      } else if (record.type === "uninstall") {
        return "卸载应用";
      }
    }
  },
  {
    title: "APP ID",
    dataIndex: "app_id",
    key: "app_id"
  },
  {
    title: "应用名称",
    dataIndex: "game_name",
    key: "game_name"
  },
  {
    title: "渠道商",
    dataIndex: "channel_name",
    key: "channel_name"
  },
  {
    title: "应用包名",
    dataIndex: "package_name",
    key: "package_name"
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
  },
  {
    title: "任务进度",
    dataIndex: "progress",
    key: "progress",
    render: (text, record) => {
      if (record.progress === 0) {
        return "未开始";
      } else if (record.progress === 1) {
        if (record.type === "install") {
          return "收到安装指令";
        } else if (record.type === "uninstall") {
          return "收到卸载指令";
        }
      } else if (record.progress === 2) {
        return "下载apk完成";
      } else if (record.progress === 3) {
        if (record.type === "install") {
          return "安装成功";
        } else if (record.type === "uninstall") {
          return "卸载成功";
        }
      } else if (record.progress === 4) {
        if (record.type === "install") {
          return "安装失败";
        } else if (record.type === "uninstall") {
          return "卸载失败";
        }
      }
    }
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
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
    dataIndex: "updated_at",
    key: "updated_at",
    width: 110,
    render: (text, record, index) => {
      let time = GetTimeOutput(record.updated_at);
      time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      return time;
    }
  }
];

export default TableDetail;
