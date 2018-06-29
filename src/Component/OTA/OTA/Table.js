import React from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { upgrade, servers } from "../../../api/api";

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
    width: 200,
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
    title: "安卓版本号",
    width: 200,
    dataIndex: "android_version",
    key: "android_version"
  },
  {
    title: "内部版本号",
    width: 200,
    dataIndex: "version",
    key: "version"
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
      loading: true,
      installing: false,
      visible: false
    };
    // this.getList = this.getList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // componentWillMount() {
  //   this.getList({});
  // }

  // ---------------------------------------------  获取列表   -------------------------------------------------
  //  获取OTA升级列表
  getList = (paramsSearch, all) => {
    this.setState({
      loading: true
    });
    const params = {
      server_status: 1,
      occupy_status: 1,
      connect_status: 1
    };
    Object.assign(params, paramsSearch);
    servers(params)
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
            if (all) {
              this.setState({
                pagination: { pageSize: res.data.total }
              });
            }
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

  start = type => {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning("请选择设备");
      return false;
    }
    this.setState({ installing: true });
    // ajax request after empty completing
    const params = {
      version: this.props.values.maintainVersion,
      resource_address: this.props.values.ftpPath,
      server_ids: this.state.selectedRowKeys
    };
    upgrade(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          this.setState({ installing: false, selectedRowKeys: [] });
          message.success(res.message);
        } else {
          this.setState({ installing: false, selectedRowKeys: [] });
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
        this.setState({
          installing: false,
          selectedRowKeys: []
        });
      });
  };

  // ---------------------------------------------  升级确定框   -------------------------------------------------

  confirm = () => {
    this.setState({ visible: false });
    // message.success("Next step.");
    this.start();
  };

  cancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: []
    });
    // message.error("Click on cancel.");
  };

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
    if (this.state.selectedRowKeys.length === 0) {
      this.confirm(); // next step
    } else {
      this.setState({ visible }); // show the popconfirm
    }
  };

  // ---------------------------------------------  选择列表   -------------------------------------------------

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
    const { loading, selectedRowKeys, installing } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Popconfirm
            title="你确定要升级吗?"
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="是"
            cancelText="否"
          >
            <Button
              type="primary"
              // onClick={this.start}
              // disabled={!hasSelected}
              loading={installing}
            >
              OTA升级
            </Button>
          </Popconfirm>
          {installing ? " 正在安装..." : null}

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
