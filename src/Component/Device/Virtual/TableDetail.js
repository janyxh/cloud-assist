import React from "react";
import FormDetail from "./FormDetail";
import { handleTimeout } from "../../../Common";
import { device } from "../../../api/api";
import { Modal, Table, message, Button } from "antd";

class TableDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      apps: [],
      dataInfo: {},
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      loading: true
    };
    this.onChange = this.onChange.bind(this);
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = server_id => {
    handleTimeout(() => {
      this.setState({ loading: false });
    });
    this.setState({ loading: true });
    device(server_id)
      .then(res => {
        this.setState({
          loading: false,
          pagination: { total: 0, current: 1 }
        });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState(
              {
                apps: res.data.apps,
                dataInfo: {
                  local_ip: res.data.local_ip, // 内网IP
                  remote_desktop_ip: res.data.remote_desktop_ip, // 外网IP
                  version: res.data.version, // 内部版本号
                  // used_cpu: res.data.used_cpu, // CPU当前速度,单位GHz
                  // total_cpu: res.data.total_cpu, // CPU基准速度,单位GHz
                  used_cpu: res.data.used_cpu, // CPU使用率
                  used_memory: res.data.used_memory, // 已用内存,单位MB
                  total_memory: res.data.total_memory, // 总内存,单位MB
                  used_disk: res.data.used_disk, // 已用存储,单位MB
                  total_disk: res.data.total_disk, // 总存储,单位MB
                  brand: res.data.brand, // 品牌
                  model: res.data.model, // 型号
                  device_name: res.data.device_name, // 名称
                  manufacturer: res.data.manufacturer, // 制造商
                  build_id: res.data.build_id, // build id
                  android_version: res.data.android_version // 安卓系统版本号
                },
                pagination: { total: res.data.apps.length }
              },
              () => {
                this.getData(1);
              }
            );
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
    // this.getList(this.props.serverId, this.state.searchParams);
  };

  onCancel = () => {
    this.props.onCancel();
    this.setState({
      data: [],
      dataInfo: {},
      pagination: { total: 0, current: 1 }
    });
  };
  render() {
    return (
      <Modal
        title={`设置ID：${this.props.serverId}`}
        visible={this.props.visible}
        width={1100}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>
            关闭
          </Button>
        ]}
        maskClosable={false}
      >
        <FormDetail dataInfo={this.state.dataInfo} />
        <Table
          rowKey="app_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
        />
      </Modal>
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
    title: "包名",
    dataIndex: "package_name",
    key: "package_name"
  },
  {
    title: "应用大小(MB)",
    dataIndex: "app_size",
    key: "app_size"
  },
  {
    title: "应用版本号",
    dataIndex: "app_version",
    key: "app_version"
  }
];

export default TableDetail;
