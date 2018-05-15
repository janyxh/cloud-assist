import React from "react";
import moment from "moment";
import TaskForm from "../../Component/Task/Form";
import { Table, message } from "antd";
import { tasks } from "../../api/api";

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
      }
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
    tasks(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: { total: res.total, current: res.page_index }
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
    const gameParams = params;
    // 转换时间格式
    if (gameParams && gameParams.created_at) {
      gameParams.createStartTime =
        moment(gameParams.created_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.createEndTime =
        moment(gameParams.created_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.created_at &&
      gameParams.createStartTime
    ) {
      gameParams.createStartTime = "";
      gameParams.createEndTime = "";
    }

    if (gameParams && gameParams.update_at) {
      gameParams.updateStartTime =
        moment(gameParams.update_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.updateEndTime =
        moment(gameParams.update_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.update_at &&
      gameParams.updateStartTime
    ) {
      gameParams.updateStartTime = "";
      gameParams.updateEndTime = "";
    }

    delete gameParams.created_at;
    delete gameParams.update_at;

    this.setState({
      searchParams: Object.assign(this.state.searchParams, gameParams),
      loading: true
    });
    console.log(this.state.searchParams);
    this.getList(this.state.searchParams);
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
      searchParams: Object.assign(this.state.searchParams, { page: page })
    });

    this.getList(this.state.searchParams);
  };

  render() {
    const columns = [
      {
        title: "序号",
        key: "index",
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "任务ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "任务名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "游戏",
        dataIndex: "gameName",
        key: "gameName"
      },
      {
        title: "渠道商",
        dataIndex: "channelName",
        key: "channelName"
      },
      {
        title: "脚本ID",
        dataIndex: "scriptId",
        key: "scriptId"
      },
      {
        title: "脚本配置明细",
        dataIndex: "scriptOptions",
        key: "scriptOptions"
      },
      {
        title: "任务状态",
        dataIndex: "status",
        key: "status",
        render: (text, record) => {
          return record.status ? "任务执行中" : "任务已结束";
        }
      },
      {
        title: "挂机点消耗",
        dataIndex: "gamePoint",
        key: "gamePoint"
      },
      {
        title: "累计时长",
        dataIndex: "timeConsume",
        key: "timeConsume"
      },
      {
        title: "用户ID",
        dataIndex: "userId",
        key: "userId"
      },
      {
        title: "创建时间",
        key: "createdAt",
        width: 110,
        render: (text, record, index) => {
          return moment(record.createdAt).format("YYYY-MM-DD hh:mm:ss");
        }
      },
      {
        title: "更新时间",
        key: "updatedAt",
        width: 110,
        render: (text, record, index) => {
          return moment(record.updatedAt).format("YYYY-MM-DD hh:mm:ss");
        }
      },
      {
        title: "结束时间",
        key: "endAt",
        width: 110,
        render: (text, record, index) => {
          return moment(record.endAt).format("YYYY-MM-DD hh:mm:ss");
        }
      }
    ];
    return (
      <div>
        <h1>任务单管理</h1>
        <hr />
        <TaskForm
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
      </div>
    );
  }
}

export default Task;
