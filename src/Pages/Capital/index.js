import React from "react";
import moment from "moment";
import CapitalForm from "../../Component/Capital/Form";
import { Table, message } from "antd";
import { queryFunds } from "../../api/api";
import { getDurning, GetTimeOutput } from "../../Common";

class Capital extends React.Component {
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
    queryFunds(params)
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

    if (gameParams.funds) {
      gameParams.funds = Number(gameParams.funds) * 100;
    }

    // 转换时间格式
    getDurning(gameParams, "created_at", "createdAtStart", "createdAtEnd");
    getDurning(gameParams, "updated_at", "updatedAtStart", "updatedAtEnd");

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

  render() {
    const columns = [
      {
        title: "序号",
        key: "index",
        width: 50,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      // {
      //   title: "id",
      //   dataIndex: "id",
      //   key: "id"
      // },
      {
        title: "支付平台订单号",
        dataIndex: "thirdPlatformId",
        key: "thirdPlatformId"
      },
      {
        title: "流水号",
        dataIndex: "orderId",
        key: "orderId"
      },
      {
        title: "用户ID",
        dataIndex: "userId",
        key: "userId"
      },
      {
        title: "申请资金(元)",
        dataIndex: "funds",
        key: "funds",
        render: (text, record) => {
          return (record.funds / 100).toFixed(2);
        }
      },
      {
        title: "结算状态",
        key: "status",
        render: (text, record) => {
          return record.status ? "已完成" : "处理中";
        }
      },
      {
        title: "支付渠道",
        key: "paymentMode",
        render: (text, record) => {
          let value;
          if (record.paymentMode === 1) {
            value = "支付宝";
          } else if (record.paymentMode === 2) {
            value = "微信";
          }
          return value;
        }
      },
      {
        title: "资金类型",
        key: "fundsType",
        render: (text, record) => {
          let value;
          if (record.fundsType === 1) {
            value = "退款";
          } else if (record.fundsType === 2) {
            value = "推广奖励";
          } else if (record.fundsType === 3) {
            value = "提现";
          } else if (record.fundsType === 4) {
            value = "账户加钱";
          } else if (record.fundsType === 5) {
            value = "账户减钱";
          } else if (record.fundsType === 6) {
            value = "支付";
          }
          return value;
        }
      },
      {
        title: "交易类型",
        key: "exchangeType",
        render: (text, record) => {
          return record.exchangeType ? "挂机点充值" : "无";
        }
      },
      {
        title: "提交方式",
        dataIndex: "submitType",
        key: "submitType",
        render: (text, record) => {
          let value;
          if (record.submitType === 1) {
            value = "在线支付";
          } else if (record.submitType === 2) {
            value = "人工确认";
          }
          return value;
        }
      },
      {
        title: "提交状态",
        key: "submitStatus",
        render: (text, record) => {
          let value;
          if (record.submitStatus === 1) {
            value = "已提交";
          } else if (record.submitStatus === 0) {
            value = "待提交";
          }
          return value;
        }
      },
      {
        title: "创建时间",
        key: "createdAt",
        // width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.createdAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "结束时间",
        key: "updatedAt",
        // width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updatedAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      }
    ];
    return (
      <div>
        <h1>资金管理</h1>
        <hr />
        <CapitalForm
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

export default Capital;
