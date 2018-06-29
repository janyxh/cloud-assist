import React from "react";
import GamesForm from "../../../Component/AppStore/Games/Form";
import GamesAdd from "../../../Component/AppStore/Games/Add";
import { Table, message, Button, Popconfirm } from "antd";
import {
  selectGame,
  getAppTypeList,
  getClassifyList,
  addGame,
  modifyGame,
  deleteGame
} from "../../../api/api";
import moment from "moment";
import { GetTimeOutput, getDurning, handleTableWidth } from "../../../Common";

class Games extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      tableScroll: handleTableWidth(1366, 1500), // 表格宽度
      data: [],
      dataType: [],
      dataClassify: [],
      searchParams: {},
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange
      },
      visible: false,
      confirmLoading: false,
      isEdit: false,
      values: {},
      imgUrl: ""
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getList = this.getList.bind(this);
    this.getAppType = this.getAppType.bind(this);
    this.getClassify = this.getClassify.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  confirm = id => {
    delete this.state.searchParams.page;
    const params = {
      game_id: id
    };
    deleteGame(params)
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
  componentDidMount() {
    this.getList({});
    this.getAppType();
    window.addEventListener("resize", this.onWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.setState({
      tableScroll: handleTableWidth(1366, 1500)
    });
  };

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    selectGame(params)
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

  // ---------------------------------------------  获取数据   -------------------------------------------------

  // 获取应用类型
  getAppType = () => {
    const params = {};
    getAppTypeList(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          this.setState({ dataType: res.data });
        } else {
          message.error(res.message);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  // 获取分类
  getClassify = id => {
    const params = { id: id };
    getClassifyList(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          this.setState({ dataClassify: res.data });
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
    getDurning(gameParams, "created_at", "created_from", "created_to");
    getDurning(gameParams, "updated_at", "updated_from", "updated_to");

    // 转换应用类型格式
    const objDataType = this.state.dataType.find(item => {
      return item.id === gameParams.app_big_type;
    });
    if (objDataType) {
      gameParams.app_big_type = objDataType.appTypeName;
    }

    // 转换分类格式
    const objClassify = this.state.dataType.find(item => {
      return item.id === gameParams.app_small_type;
    });
    if (objClassify) {
      gameParams.app_small_type = objClassify.appTypeName;
    }

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
      loading: true,
      dataClassify: []
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
        values: {},
        imgUrl: ""
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
        values: Object.assign(this.state.values, values),
        visible: true,
        imgUrl: values.game_icon
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

  handleSetIcon = imgUrl => {
    this.setState({ imgUrl: imgUrl });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    delete this.state.searchParams.page;
    this.setState({
      confirmLoading: true
    });

    const params = values;

    // 转换应用类型格式
    const objDataType = this.state.dataType.find(item => {
      return item.id === params.app_big_type;
    });
    if (objDataType) {
      params.app_big_type = objDataType.appTypeName;
    }

    if (!isEdit) {
      addGame(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false
            });
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
    } else {
      params.game_id = this.state.values.game_id;
      modifyGame(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false
            });
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

  // 点击弹出框的取消
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const columns = [
      {
        title: "序号",
        key: "index",
        // width: 80,
        // fixed: "left",
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "应用ID",
        dataIndex: "game_id",
        key: "game_id"
        // width: 100,
        // fixed: "left"
      },
      {
        title: "应用名称",
        dataIndex: "game_name",
        key: "game_name"
      },
      {
        title: "应用图标",
        key: "game_icon",
        render: (text, record) => (
          <img
            src={record.game_icon}
            alt={record.game_name}
            width="40"
            height="40"
          />
        )
      },
      {
        title: "文字描述",
        dataIndex: "description",
        key: "description",
        width: 140
      },
      {
        title: "应用类型",
        dataIndex: "app_big_type",
        key: "app_big_type"
      },
      {
        title: "分类",
        dataIndex: "app_small_type",
        key: "app_small_type"
      },
      {
        title: "所属平台",
        dataIndex: "app_platform",
        key: "app_platform"
      },
      {
        title: "厂商",
        dataIndex: "vendor",
        key: "vendor"
      },
      {
        title: "渠道商",
        key: "channel_names",
        render: (text, record, index) => {
          let str = "";
          if (record.channel_names && record.channel_names.length > 0) {
            record.channel_names.forEach((item, index) => {
              index > 0 ? (str += `，${item}`) : (str += item);
            });
          }
          return str;
        }
      },
      {
        title: "排序优先级",
        dataIndex: "priority",
        key: "priority"
      },
      {
        title: "应用上架状态",
        key: "shelf_status",
        render: (text, record, index) => {
          return record.shelf_status ? "上架" : "下架";
        }
      },
      {
        title: "创建时间",
        key: "created_at",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.created_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updated_at",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updated_at);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "操作",
        key: "action",
        width: 140,
        fixed: document.body.clientWidth <= 1366 ? "right" : "",
        render: (text, record) => {
          return (
            <div className="action">
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
              <Popconfirm
                title="你确定要删除吗?"
                onConfirm={this.confirm.bind(this, record.game_id)}
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
        <h1>游戏管理</h1>
        <hr />
        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <GamesForm
          params={this.state.searchParams}
          dataType={this.state.dataType}
          dataClassify={this.state.dataClassify}
          onChangeDataType={this.getClassify}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="game_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
          scroll={this.state.tableScroll}
        />
        <GamesAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          imgUrl={this.state.imgUrl}
          dataType={this.state.dataType}
          dataClassify={this.state.dataClassify}
          onChangeDataType={this.getClassify}
          handleSetIcon={this.handleSetIcon}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Games;
