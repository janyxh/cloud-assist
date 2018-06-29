import React from "react";
import { Table, Button, message } from "antd";
import { batchAction, servers } from "../../../api/api";

const columns = [
  {
    title: "序号",
    key: "index",
    width: 100,
    render: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: "设备ID",
    dataIndex: "server_id",
    width: 200
  },
  {
    title: "设备状态",
    key: "server_status",
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
    title: "存储空间剩余(MB)",
    key: "address",
    width: 200,
    render: (text, record) => {
      return record.free_disk;
    }
  }
];
class TableInstall extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      searchParams: {},
      selectedRowKeys: [], // Check here to configure the default column
      loading: true, //表格loading
      beingInstall: false,
      installing: false,
      loadingInstall: false // 安装时加载loading
    };
    this.getList = this.getList.bind(this);
  }

  // componentDidMount() {
  //   this.getList();
  // }

  // ---------------------------------------------  获取列表   -------------------------------------------------
  //  查询安装卸载列表列表
  getList = (params, all) => {
    this.setState({ loading: true });
    let installParams = {
      is_get_details: true
    };
    installParams = Object.assign(installParams, params);
    servers(installParams)
      .then(res => {
        this.setState({
          loading: false
        });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: {
                total: res.data.total,
                current: res.data.pageNum,
                pageSize: 10
              }
            });
          } else {
            this.setState({
              data: [],
              pagination: { total: 0, current: 1 }
            });
          }
          if (all) {
            this.setState({
              pagination: { pageSize: res.data.total }
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

  // ---------------------------------------------  操作   -------------------------------------------------
  start = type => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warning("请选择设备");
      return false;
    }
    if (type === "install") {
      this.setState({ beingInstall: true, installing: true });
    }
    this.setState({ loadingInstall: true });
    // ajax request after empty completing
    const params = {
      type: type,
      server_ids: selectedRowKeys
    };
    batchAction(this.props.appId, params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          if (type === "install") {
            this.setState({ beingInstall: false, installing: false });
          }
          message.success(res.message);
        } else {
          if (type === "install") {
            this.setState({ beingInstall: false, installing: false });
          }
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
    this.setState({
      selectedRowKeys: [],
      loadingInstall: false
    });
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

  // ---------------------------------------------  选择列表项   -------------------------------------------------
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  //清除选择数据
  handelClear = () => {
    this.setState({
      selectedRowKeys: [],
      data: [],
      pagination: { total: 0, current: 1 }
    });
  };

  render() {
    const { isInstall } = this.props;
    const {
      loading,
      selectedRowKeys,
      beingInstall,
      installing,
      loadingInstall
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    // const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          {!beingInstall ? (
            <Button
              type="primary"
              onClick={this.start.bind(
                this,
                isInstall ? "install" : "uninstall"
              )}
              // disabled={!hasSelected}
              loading={loadingInstall}
            >
              {isInstall ? "安装" : "卸载"}
            </Button>
          ) : null}
          {beingInstall ? (
            <div>
              {/* <Button
                onClick={this.start.bind(
                  this,
                  beingInstall && installing ? "stop" : "start"
                )}
              >
                {installing ? "暂停" : "打开"}
              </Button> */}
              {installing ? " 正在安装..." : null}
            </div>
          ) : null}

          {/* <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span> */}
        </div>
        <Table
          rowKey="server_id"
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          scroll={{ x: 700, y: 320 }}
        />
      </div>
    );
  }
}

export default TableInstall;
