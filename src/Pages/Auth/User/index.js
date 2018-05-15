import React from "react";
import UserForm from "../../../Component/Auth/User/Form";
import UserAdd from "../../../Component/Auth/User/Add";
import { Table, message } from "antd";
import { getUserList } from "../../../api/api";

const columns = [
  {
    title: "登录账号",
    dataIndex: "loginAccount",
    key: "loginAccount"
  },
  {
    title: "昵称",
    dataIndex: "nickName",
    key: "nickName"
  },
  {
    title: "姓名",
    dataIndex: "realName",
    key: "realName"
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex"
  },
  {
    title: "QQ",
    dataIndex: "qq",
    key: "qq"
  },
  {
    title: "微信",
    dataIndex: "weiXin",
    key: "weiXin"
  },
  {
    title: "手机号",
    dataIndex: "phoneNumber",
    key: "phoneNumber"
  },
  {
    title: "部门",
    dataIndex: "department",
    key: "department"
  },
  // {
  //   title: "操作",
  //   key: "isDeleted",
  //   render: (text, record) => {
  //     // console.log(text);
  //     // console.log(record);
  //     const { isDeleted } = record;
  //     return (
  //       <div className="action">
  //         <Popconfirm
  //           title="Are you sure delete this task?"
  //           onConfirm={confirm}
  //           okText="Yes"
  //           cancelText="No"
  //         >
  //           {isDeleted ? <a>启用</a> : <a>禁用</a>}
  //         </Popconfirm>
  //         <a>修改密码</a>
  //         <a>编辑</a>
  //         <Popconfirm
  //           title="Are you sure delete this task?"
  //           onConfirm={confirm}
  //           okText="Yes"
  //           cancelText="No"
  //         >
  //           <a className="danger">删除</a>
  //         </Popconfirm>
  //       </div>
  //     );
  //   }
  // }
];

// function confirm(e) {
//   console.log(e);
//   message.success("Click on Yes");
// }

class User extends React.Component {
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
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false
    };
    this.getList = this.getList.bind(this);
    // this.getAppType = this.getAppType.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getList({});
    // this.getAppType();
  }

  // 获取列表
  getList = params => {
    getUserList(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          // data = res.data;
          this.setState({
            data: res.data.list,
            pagination: { total: res.data.total, current: res.pageNum }
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  // 搜索
  handelSearch = params => {
    this.setState({
      searchParams: params
    });
    this.getList(params);
  };

  // 重置
  handleReset = () => {
    this.getList({});
  };

  // 分页-选择第几页
  onChange = page => {
    this.setState({
      pagination: {
        current: page
      },
      searchParams: Object.assign(this.state.searchParams, { page: page })
    });

    this.getList(this.state.searchParams);
  };

  // 打开弹出框
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  // 点击弹出框的确定
  handleOk = () => {
    console.log("点击ok");
    this.setState({
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  // 点击弹出框的取消
  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };
  render() {
    return (
      <div>
        <h1>用户管理</h1>
        <hr />

        {/* <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
          <Button>编辑</Button>
        </div> */}
        <UserForm
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
        <UserAdd
          title="Title"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default User;
