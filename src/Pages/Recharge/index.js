import React from "react";
import moment from "moment";
import RechargeForm from "../../Component/Recharge/Form";
import { Table, message } from "antd";
import { queryOrder } from "../../api/api";

class Recharge extends React.Component {
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
    queryOrder(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: { total: res.data.total, current: res.pageNum }
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
    if (gameParams && gameParams.createdAt) {
      gameParams.createStartTime =
        moment(gameParams.createdAt[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.createEndTime =
        moment(gameParams.createdAt[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.createdAt &&
      gameParams.createStartTime
    ) {
      gameParams.createStartTime = "";
      gameParams.createEndTime = "";
    }

    if (gameParams && gameParams.updatedAt) {
      gameParams.updateStartTime =
        moment(gameParams.updatedAt[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.updateEndTime =
        moment(gameParams.updatedAt[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.updatedAt &&
      gameParams.updateStartTime
    ) {
      gameParams.updateStartTime = "";
      gameParams.updateEndTime = "";
    }

    delete gameParams.createdAt;
    delete gameParams.updatedAt;

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
        title: "充值单号",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "挂机点",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "金额（元）",
        dataIndex: "price",
        key: "price",
        width: 200
      },
      {
        title: "支付渠道",
        key: "paymentMode",
        render: (text, record) => {
          let paymentMode;
          if (record.paymentMode === 1) {
            paymentMode = "支付宝支付";
          } else if (record.paymentMode === 2) {
            paymentMode = "微信支付";
          }
          return paymentMode;
        }
      },
      {
        title: "订单状态",
        key: "status",
        render: (text, record) => {
          let status;
          if (record.status === 1) {
            status = "已付款";
          } else if (record.status === 2) {
            status = "已完成";
          }
          return status;
        }
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
      }
    ];
    return (
      <div>
        <h1>充值订单管理</h1>
        <hr />
        <RechargeForm
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

export default Recharge;
