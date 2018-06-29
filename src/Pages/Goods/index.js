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
import { getDurning, GetTimeOutput } from "../../Common";

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

  // ---------------------------------------------  新增编辑弹出框   -------------------------------------------------

  // 打开弹出框
  showModal = () => {
    this.setState(
      {
        isEdit: false,
        visible: true,
        values: {}
      },
      () => {
        if (
          document.querySelectorAll(".ant-modal-body") &&
          document.querySelectorAll(".ant-modal-body").length > 0
        ) {
          setTimeout(() => {
            document.querySelectorAll(".ant-modal-body").forEach(element => {
              element.scrollTop = 0;
            });
          }, 50);
        }
      }
    );
  };

  // 编辑
  handleEdit = values => {
    this.setState(
      {
        isEdit: true,
        visible: true,
        values: Object.assign(this.state.values, values)
      },
      () => {
        if (
          document.querySelectorAll(".ant-modal-body") &&
          document.querySelectorAll(".ant-modal-body").length > 0
        ) {
          setTimeout(() => {
            document.querySelectorAll(".ant-modal-body").forEach(element => {
              element.scrollTop = 0;
            });
          }, 50);
        }
      }
    );
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    delete this.state.searchParams.page;
    this.setState({
      confirmLoading: true
    });

    const params = values;

    if (!isEdit) {
      addGamePoint(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              values: {}
            });
            message.success(res.message);
            this.getList(this.state.searchParams);
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
            this.setState(
              {
                visible: false,
                confirmLoading: false
              },
              () => {
                fn && fn();
              }
            );
            // setTimeout(() => {
            //   this.setState({
            //     values: {}
            //   });
            // }, 50);

            message.success(res.message);
            this.getList(this.state.searchParams);
            fn && fn();
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
    this.setState({
      visible: false
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------
  // 删除
  confirm = id => {
    delete this.state.searchParams.page;
    const params = {
      id: id
    };
    delGamePoint(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          message.success(res.message);
          this.getList(this.state.searchParams);
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
        title: "商品价格(元)",
        key: "price",
        render: (text, record) => {
          return record.price / 100;
        }
      },
      {
        title: "商品单价",
        key: "univalent",
        render: (text, record) => {
          return (record.price / record.amount / 100).toFixed(2);
        }
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
          let time = GetTimeOutput(record.createdAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updatedAt",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updatedAt);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "操作",
        key: "action",
        width: 100,
        render: (text, record) => {
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
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Task;
