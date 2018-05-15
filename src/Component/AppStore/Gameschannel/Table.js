import React from "react";
import { Table, Button, message } from "antd";
import { appsAction, servers } from "../../../api/api";

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
    dataIndex: "name"
  },
  {
    title: "设备状态",
    dataIndex: "age"
  },
  {
    title: "存储空间剩余(MB)",
    dataIndex: "address"
  }
];
class TableInstall extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      beingInstall: false,
      installing: false
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.handleSelect();
  }
  //  查询安装卸载列表列表
  handleSelect = () => {
    servers({})
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.error(e);
      });
  };
  start = type => {
    console.log("type" + type);
    if (type === "install") {
      this.setState({ beingInstall: true, installing: true });
    }
    this.setState({ loading: true });
    // ajax request after empty completing
    const params = {
      type: type,
      server_id: 0
    };
    appsAction(params)
      .then(res => {
        console.log(res);
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
      loading: false
    });
  };
  onSelectChange = selectedRowKeys => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    const { isInstall } = this.props;
    const { loading, selectedRowKeys, beingInstall, installing } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
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
              loading={loading}
            >
              {isInstall ? "安装" : "卸载"}
            </Button>
          ) : null}
          {beingInstall ? (
            <div>
              <Button
                onClick={this.start.bind(
                  this,
                  beingInstall && installing ? "stop" : "start"
                )}
              >
                {installing ? "暂停" : "打开"}
              </Button>
              {installing ? "正在安装..." : null}
            </div>
          ) : null}

          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
        <Table
          loading={this.loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}

export default TableInstall;
