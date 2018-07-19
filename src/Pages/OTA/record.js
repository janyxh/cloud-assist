import React from "react";
import moment from "moment";
import OTARecordForm from "../../Component/OTA/OTARecord/Form";
import Detail from "../../Component/OTA/OTARecord/Detail";
import { Table, message } from "antd";
import { selectPackages, deleteMirrorImage } from "../../api/api";
import { getDurning, GetTimeOutput, handleTableWidth } from "../../Common";

class OTA extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      tableScroll: handleTableWidth(1366, 1600), // 表格宽度
      data: [],
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      visibleDetail: false, // 查询详情 弹出框  显示隐藏
      values: {}
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getList = this.getList.bind(this);
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
      tableScroll: handleTableWidth(1366, 1600)
    });
  };

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    selectPackages(params)
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
    getDurning(gameParams, "created_at", "created_from", "created_to");
    getDurning(gameParams, "updated_at", "updated_from", "updated_to");

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

  // ---------------------------------------------  删除   -------------------------------------------------
  // 删除
  confirm = id => {
    delete this.state.searchParams.page;
    const params = {
      id: id
    };
    deleteMirrorImage(params)
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

  // ---------------------------------------------  详情弹出框   -------------------------------------------------

  // 查看详情
  handleDetail = values => {
    this.setState(
      {
        visibleDetail: true,
        values: values
      },
      () => {
        this.refs.Detail.handelGetList();
      }
    );
  };

  // 点击弹出框的关闭
  handleCancelDetail = () => {
    this.setState({
      visibleDetail: false
    });
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
        title: "任务Id",
        dataIndex: "upgrade_id",
        key: "upgrade_id"
        // width: 120,
        // fixed: "left"
      },
      {
        title: "总数量",
        dataIndex: "total_count",
        key: "total_count"
      },
      {
        title: "失败数量",
        dataIndex: "failed_count",
        key: "failed_count"
      },
      {
        title: "安卓版本号",
        dataIndex: "android_version",
        key: "android_version"
      },
      {
        title: "内部版本号",
        dataIndex: "maintain_version",
        key: "maintain_version"
      },
      {
        title: "任务结果",
        key: "result",
        render: (text, record) => {
          if (record.total_count === record.upgraded_count) {
            // 设备总数量 = 设备成功数量
            return "升级成功";
          } else if (
            record.total_count >
            record.upgraded_count + record.failed_count
          ) {
            return "进行中";
          } else if (
            record.total_count ===
              record.upgraded_count + record.failed_count &&
            record.failed_count > 0
          ) {
            return "升级失败";
          }
        }
      },
      {
        title: "镜像ID",
        dataIndex: "packages_id",
        key: "packages_id"
      },
      {
        title: "镜像名称",
        dataIndex: "image_name",
        key: "image_name"
      },
      {
        title: "镜像包大小(MB)",
        dataIndex: "image_size",
        key: "image_size"
      },
      // {
      //   title: "镜像包路径",
      //   dataIndex: "ftp_path",
      //   key: "ftp_path"
      // },
      {
        title: "备注",
        dataIndex: "memo",
        key: "memo"
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
      // {
      //   title: "创建结束时间",
      //   key: "create_time",
      //   width: 110,
      //   render: (text, record, index) => {
      //     if (record.create_time) {
      //       let time = GetTimeOutput(record.create_time);
      //       time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      //       return time;
      //     }
      //   }
      // },
      // {
      //   title: "更新开始时间",
      //   key: "update_time",
      //   width: 110,
      //   render: (text, record, index) => {
      //     if (record.update_time) {
      //       let time = GetTimeOutput(record.update_time);
      //       time = moment(time).format("YYYY-MM-DD HH:mm:ss");
      //       return time;
      //     }
      //   }
      // },
      {
        title: "操作",
        key: "action",
        width: 100,
        fixed: document.body.clientWidth <= 1366 ? "right" : "",
        render: (text, record) => {
          return (
            <div className="action">
              <a onClick={this.handleDetail.bind(this, record)}>查看</a>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <h1>OTA升级记录</h1>
        <hr />
        <OTARecordForm
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="upgrade_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
          // scroll={this.state.tableScroll}
        />
        <Detail
          ref="Detail"
          visibleDetail={this.state.visibleDetail}
          values={this.state.values}
          onCancel={this.handleCancelDetail}
        />
      </div>
    );
  }
}

export default OTA;
