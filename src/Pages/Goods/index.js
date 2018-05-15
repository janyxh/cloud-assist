import React from "react";
import moment from "moment";
import GoodsForm from "../../Component/Goods/Form";
import GoodsAdd from "../../Component/Goods/Add";
import { Button, Table, message, Popconfirm } from "antd";
import {
  queryGamePoint,
  addGamePoint,
  updateGamePoint,
  delGamePoint
} from "../../api/api";

class Task extends React.Component {
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
      visible: false, // 新增编辑弹出框 显示隐藏
      confirmLoading: false, // 新增编辑弹出框 点击确定按钮时加载禁用状态
      isEdit: false, // 新增编辑弹出框 判断是新增还是编辑
      values: {} // 新增编辑弹出框 编辑时传入的参数
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
    queryGamePoint(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          if (res.data) {
            this.setState({
              data: res.data.list,
              pagination: { total: res.total, current: res.page_index }
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
    if (gameParams && gameParams.created_at) {
      gameParams.createdAtStart =
        moment(gameParams.created_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.createdAtEnd =
        moment(gameParams.created_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.created_at &&
      gameParams.createdAtStart
    ) {
      gameParams.createdAtStart = "";
      gameParams.createdAtEnd = "";
    }

    if (gameParams && gameParams.update_at) {
      gameParams.updatedAtStart =
        moment(gameParams.update_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.updatedAtEnd =
        moment(gameParams.update_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.update_at &&
      gameParams.updatedAtStart
    ) {
      gameParams.updatedAtStart = "";
      gameParams.updatedAtEnd = "";
    }

    delete gameParams.created_at;
    delete gameParams.update_at;

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

  // ---------------------------------------------  新增编辑弹出框   -------------------------------------------------

  // 打开弹出框
  showModal = () => {
    this.setState({
      isEdit: false,
      visible: true,
      values: {}
    });
  };

  // 编辑
  handleEdit = values => {
    this.setState({
      isEdit: true,
      visible: true,
      values: Object.assign(this.state.values, values)
    });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit) => {
    console.log("点击ok");
    this.setState({
      confirmLoading: true
    });

    const params = values;

    console.log(params);
    if (!isEdit) {
      addGamePoint(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              scriptUrl: ""
            });
            message.success(res.message);
            this.getList({});
          } else {
            message.error(res.message);
            this.setState({
              confirmLoading: false
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      params.id = this.state.values.id;

      updateGamePoint(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              scriptUrl: "",
              values: {}
            });
            message.success(res.message);
            this.getList({});
          } else {
            message.error(res.message);
            this.setState({
              confirmLoading: false
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  // 关闭弹出框
  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------
  // 删除
  confirm = id => {
    const params = {
      id: id
    };
    delGamePoint(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          message.success(res.message);
          this.getList({});
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
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
        title: "商品ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "商品名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "商品类型",
        key: "goodsType",
        render: (text, record) => {
          return record.goodsType === 2 ? "挂机点" : record.goodsType;
        }
      },
      {
        title: "商品规格",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "商品价格",
        dataIndex: "price",
        key: "price"
      },
      {
        title: "商品描述",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "活动",
        key: "promotion",
        render: (text, record) => {
          return record.promotion ? "有" : "无";
        }
      },
      {
        title: "页头标",
        key: "pageFlag",
        render: (text, record) => {
          return record.pageFlag ? "有" : "无";
        }
      },
      {
        title: "排序",
        dataIndex: "orderId",
        key: "orderId"
      },
      {
        title: "上架状态",
        key: "status",
        render: (text, record) => {
          return record.status ? "上架" : "下架";
        }
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
      },
      {
        title: "操作",
        key: "action",
        width: 140,
        render: (text, record) => {
          // console.log(text);
          // console.log(record);
          return (
            <div className="action">
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
              <Popconfirm
                title="你确定要删除吗"
                onConfirm={this.confirm.bind(this, record.id)}
                okText="是"
                cancelText="否"
              >
                <a className="danger">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <h1>商品管理</h1>
        <hr />

        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <GoodsForm
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
        <GoodsAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          handleUploadLoading={this.handleUploadLoading}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Task;
