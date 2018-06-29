import React from "react";
import moment from "moment";
import InstallRecordForm from "../../../Component/AppStore/InstallRecord/Form";
import InstallDetail from "../../../Component/AppStore/InstallRecord/InstallDetail";
import { Table, message } from "antd";
import {
  selectOperations,
  selectGame,
  selectChannelName
} from "../../../api/api";
import { getDurning, GetTimeOutput } from "../../../Common";

class OTA extends React.Component {
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
      visible: false,
      values: {},
      gameList: [],
      channel_names: [] // 渠道商列表数组（筛选用）
    };
    this.getList = this.getList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getList({});
    this.getGameList();
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    selectOperations(params)
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
    // id转换数字类型
    if (gameParams.batch_action_id) {
      gameParams.batch_action_id = Number(gameParams.batch_action_id);
    }
    if (gameParams.app_id) {
      gameParams.app_id = Number(gameParams.app_id);
    }

    // 转换时间格式
    getDurning(gameParams, "created_at", "created_from", "created_to");
    getDurning(gameParams, "updated_at", "updated_from", "updated_to");

    // 转换游戏名称格式
    const objDataType = this.state.gameList.find(item => {
      return item.game_id === gameParams.game_name;
    });
    if (objDataType) {
      gameParams.game_name = objDataType.game_name;
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

  // ---------------------------------------------  操作   -------------------------------------------------

  // 查看详情
  handleViewDetail = values => {
    this.setState(
      {
        visible: true,
        values: values
      },
      () => {
        setTimeout(() => {
          this.refs.InstallDetail.handleGetlist(values.batch_action_id);
        }, 50);
      }
    );
  };

  // 关闭弹出框
  handleCancel = () => {
    this.setState({
      visible: false
    });
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
        title: "任务Id",
        dataIndex: "batch_action_id",
        key: "batch_action_id"
        // width: 50
      },
      {
        title: "任务类型",
        dataIndex: "type",
        key: "type",
        // width: 80,
        render: (text, record) => {
          if (record.type === "install") {
            return "安装应用";
          } else if (record.type === "uninstall") {
            return "卸载应用";
          }
        }
      },
      {
        title: "虚拟机数量",
        dataIndex: "total_count",
        key: "total_count"
      },
      {
        title: "失败数量",
        dataIndex: "failed_count",
        key: "failed_count"
      },
      {
        title: "APP ID",
        dataIndex: "app_id",
        key: "app_id"
      },
      {
        title: "游戏名字",
        dataIndex: "game_name",
        key: "game_name"
        // width: 100
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
        // width: 150
      },
      {
        title: "版本号",
        dataIndex: "version",
        key: "version"
        // width: 140
      },
      // {
      //   title: "任务进度",
      //   key: "progress",
      //   render: (text, record) => {
      //     if (record.progress === 0) {
      //       return "未开始";
      //     } else if (record.progress === 1) {
      //       return "收到安装卸载指令";
      //     } else if (record.progress === 2) {
      //       return "下载apk完成";
      //     } else if (record.progress === 3) {
      //       return "安装卸载成功";
      //     } else if (record.progress === 4) {
      //       return "安装卸载失败";
      //     } else {
      //       return "";
      //     }
      //   }
      // },
      {
        title: "任务结果",
        key: "task_status",
        render: (text, record) => {
          if (record.total_count === record.upgraded_count) {
            // 设备总数量 = 成功的设备数量
            return "成功";
          } else if (
            record.total_count >
            record.upgraded_count + record.failed_count
          ) {
            // 设备总数量 > 成功数量 +  失败数量
            return "进行中";
          } else if (
            record.total_count ===
              record.upgraded_count + record.failed_count &&
            record.failed_count > 0
          ) {
            // 设备总数量 = 成功数量 +  失败数量 &&   有部分设备失败
            return "失败";
          } else {
            return "";
          }
        }
      },
      {
        title: "创建时间",
        key: "created_at",
        // width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.created_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updated_at",
        // width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updated_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "操作",
        key: "action",
        width: 50,
        render: (text, record, index) => {
          return <a onClick={this.handleViewDetail.bind(this, record)}>查看</a>;
        }
      }
    ];
    return (
      <div>
        <h1>安装卸载记录</h1>
        <hr />
        <InstallRecordForm
          params={this.state.searchParams}
          gameList={this.state.gameList}
          channel_names={this.state.channel_names}
          onChangeGame={this.getChannelNames}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="batch_action_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
        />
        <InstallDetail
          ref="InstallDetail"
          visible={this.state.visible}
          values={this.state.values}
          onCancel={this.handleCancel}
          handleGetlist={this.handleGetlist}
        />
      </div>
    );
  }
}

export default OTA;
