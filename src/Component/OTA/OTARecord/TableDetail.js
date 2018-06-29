import React from "react";
import FormDetail from "./FormDetail";
import moment from "moment";
import { GetTimeOutput, getDurning } from "../../../Common";
import { Table, message } from "antd";
import { detailPackage } from "../../../api/api";

class TableInstall extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      list: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      searchParams: {},
      selectedRowKeys: [], // Check here to configure the default column
      loading: true,
      installing: false
    };
    // this.getList = this.getList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------
  //  获取OTA升级列表
  getList = params => {
    this.setState({ loading: true });
    const upgrade_id = this.props.values.upgrade_id;
    // const detailParams = {
    //   version: this.props.values.android_version
    // };
    detailPackage(upgrade_id, params)
      .then(res => {
        this.setState({
          loading: false
        });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState(
              {
                list: res.data,
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
      loading: true,
      list: []
    });
    this.getList({});
  };

  // ---------------------------------------------  分页   -------------------------------------------------

  // 根据页数获取apps数组里的数据
  getData = page => {
    const data = [];
    const { list } = this.state;
    for (let i = 0; i < 10; i++) {
      let j = (page - 1) * 10 + i;
      let datai = list[j];
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
      searchParams: Object.assign(this.state.searchParams, { page: page })
    });
    this.getData(page);
  };

  // ---------------------------------------------  操作   -------------------------------------------------
  // 清除搜索值
  handelClear = () => {
    this.refs.FormDetail.handelClear();
    this.setState({
      data: [],
      pagination: { total: 0, current: 1 }
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

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
        title: "内部版本号",
        dataIndex: "version",
        key: "version"
      },
      {
        title: "升级进度",
        key: "progress",
        dataIndex: "progress",
        render: (text, record) => {
          if (record.progress === 0) {
            return "未开始";
          } else if (record.progress === 1) {
            return "收到升级指令";
          } else if (record.progress === 2) {
            return "下载升级包完成";
          } else if (record.progress === 3) {
            return "升级成功";
          } else if (record.progress === 4) {
            return "升级失败";
          } else {
            return "";
          }
        }
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        key: "created_at",
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
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updated_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      }
    ];
    return (
      <div>
        <FormDetail
          ref="FormDetail"
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
        />
      </div>
    );
  }
}

export default TableInstall;
