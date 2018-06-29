import React from "react";
import moment from "moment";
import AppUsersForm from "../../../Component/AppUsers/Form";
import { Table, message } from "antd";
import { selectAppUsers } from "../../../api/api";
import { getDurning, GetTimeOutput } from "../../../Common";

class AppUsers extends React.Component {
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
    params = Object.assign(params, { page_size: 10 });
    selectAppUsers(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: {
                total: res.data.total,
                current: res.data.page_index
              }
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
    // if (gameParams.user_id !== "") {
    //   gameParams.user_id = Number(gameParams.user_id);
    // }
    // 转换时间格式
    getDurning(gameParams, "created_at", "min_created_at", "max_created_at");

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
      searchParams: Object.assign(this.state.searchParams, {
        page_index: page
      }),
      loading: true
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
        title: "用户ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "昵称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "手机号",
        key: "phone",
        render: (text, record) => {
          return `+${record.phone.nation_code} ${record.phone.phone}`;
        }
      },
      {
        title: "微信",
        dataIndex: "wechat",
        key: "wechat"
      },
      {
        title: "QQ",
        dataIndex: "qq",
        key: "qq"
      },
      {
        title: "账户余额",
        dataIndex: "money",
        key: "money"
      },
      {
        title: "挂机点",
        dataIndex: "gamePoint",
        key: "gamePoint"
      },
      {
        title: "注册时间",
        key: "created_at",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.created_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      }
    ];
    return (
      <div>
        <h1>用户管理</h1>
        <hr />
        <AppUsersForm
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

export default AppUsers;
