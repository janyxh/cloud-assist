import React from "react";
import moment from "moment";
import TaskForm from "../../Component/Task/Form";
import { Table, message } from "antd";
import { tasks, selectGame, selectChannelName } from "../../api/api";
import { getDurning, GetTimeOutput, handleTableWidth } from "../../Common";

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      tableScroll: handleTableWidth(1366, 1500), // 表格宽度
      data: [],
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      gameList: [],
      channel_names: [] // 渠道商列表数组（筛选用）
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getList = this.getList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getList({});
    this.getGameList();
    window.addEventListener("resize", this.onWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.setState({
      tableScroll: handleTableWidth(1366, 1500)
    });
  };

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

  // 获取游戏列表
  getGameList = () => {
    selectGame()
      .then(res => {
        this.setState({
          gameList: res.data.list
        });
      })
      .catch(e => {
        console.error(e);
      });
  };

  // 获取渠道商列表
  getChannelNames = id => {
    const params = {
      game_id: id
    };
    selectChannelName(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          this.setState({
            channel_names: res.data.channel_names || []
          });
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
    getDurning(gameParams, "created_at", "createStartTime", "createEndTime");
    getDurning(gameParams, "updated_at", "updateStartTime", "updateEndTime");

    // 转换游戏名称格式
    const objDataType = this.state.gameList.find(item => {
      return item.game_id === gameParams.gameName;
    });
    if (objDataType) {
      gameParams.gameName = objDataType.game_name;
    }

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
      loading: true,
      channel_names: []
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
        title: "任务ID",
        dataIndex: "id",
        key: "id"
        // width: 100,
        // fixed: "left"
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
        key: "scriptOptions",
        dataIndex: "scriptOptions",
        render: (text, record) => {
          let scriptOptions = JSON.parse(record.scriptOptions);
          if (typeof scriptOptions === "string") {
            return false;
          }
          let option = "";
          if (scriptOptions && scriptOptions.length === 0) {
            option = "";
          } else if (scriptOptions) {
            if (scriptOptions && scriptOptions.length > 0) {
              scriptOptions.forEach((item, index) => {
                index === 0
                  ? (option += `[${item.name}：`)
                  : (option += `，[${item.name}：`);
                if (item.option && item.option.length > 0) {
                  item.option.forEach((itemOption, indexOP) => {
                    indexOP === 0
                      ? (option += `${itemOption}`)
                      : (option += `，${itemOption}`);
                  });
                }

                option += "]";
              });
            }
          }
          return option;
        }
      },
      {
        title: "任务状态",
        dataIndex: "status",
        key: "status",
        render: (text, record) => {
          let status;
          if (record.status === 0) {
            status = "初始化";
          } else if (record.status === 1) {
            status = "启动脚本app";
          } else if (record.status === 2) {
            status = "启动游戏app";
          } else if (record.status === 3) {
            status = "挂机中";
          } else if (record.status === 4) {
            status = "已结束";
          } else if (record.status === 5) {
            status = "异常结束";
          } else if (record.status === 6) {
            status = "任务超时";
          } else if (record.status === 9) {
            status = "结束中";
          } else if (record.status === 10) {
            status = "任务启动失败";
          } else if (record.status === 11) {
            status = "未开始挂机，结束中";
          }
          return status;
        }
      },
      {
        title: "异常描述",
        dataIndex: "errorInfo",
        key: "errorInfo",
        width: 100
      },
      {
        title: "挂机点消耗",
        dataIndex: "gamePoint",
        key: "gamePoint"
      },
      {
        title: "累计时长",
        dataIndex: "timeConsume",
        key: "timeConsume",
        width: 110,
        render: (text, record) => {
          let time = new Date(record.timeConsume);
          time.setHours(time.getHours() - 8);
          const day = time.getDate() - 1 ? time.getDate() - 1 + " " : "";
          return day + moment(time).format("HH:mm:ss");
        }
      },
      {
        title: "设备ID",
        dataIndex: "deviceId",
        key: "deviceId"
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
          let time = GetTimeOutput(record.createdAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updatedAt",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updatedAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "结束时间",
        key: "endAt",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.endAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      }
    ];
    return (
      <div>
        <h1>任务单管理</h1>
        <hr />
        <TaskForm
          params={this.state.searchParams}
          gameList={this.state.gameList}
          channel_names={this.state.channel_names}
          onChangeGame={this.getChannelNames}
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
          scroll={this.state.tableScroll}
        />
      </div>
    );
  }
}

export default Task;
