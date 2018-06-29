import React from "react";
import GameschannelForm from "../../../Component/AppStore/Gameschannel/Form";
import GameschannelAdd from "../../../Component/AppStore/Gameschannel/Add";
import GameschannelInstall from "../../../Component/AppStore/Gameschannel/Install";
import { Table, message, Button, Popconfirm } from "antd";
import {
  selectGame,
  selectApps,
  getAppTypeList,
  getClassifyList,
  getGameInfo,
  addApps,
  editApps,
  deleteApp
} from "../../../api/api";
import moment from "moment";
import { GetTimeOutput, getDurning, handleTableWidth } from "../../../Common";

class Games extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true, // 列表loading
      tableScroll: handleTableWidth(1600, 1800), // 表格宽度
      data: [], // 列表data
      gameList: [], // 游戏列表数组（新增用）
      dataType: [], // 应用类型数组
      dataClassify: [], // 分类
      appPlatform: undefined,
      searchParams: {}, // 搜索筛选参数
      pagination: {
        // 表格分页参数
        pageSize: 10,
        current: 1,
        total: 0,
        onChange: this.onChange // 选择第几页时触发的事件
      },
      visible: false, // 新增编辑弹出框 显示隐藏
      confirmLoading: false, // 新增编辑弹出框 点击确定按钮时加载禁用状态
      isEdit: false, // 新增编辑弹出框 判断是新增还是编辑
      values: {}, // 新增编辑弹出框 编辑时传入的参数
      loadingUploadApk: false, // 新增编辑弹出框  上传安装包时loading
      apkUrl: "", // 新增编辑弹出框  安装包地址
      game_info: {}, // 新增编辑弹出框 应用的信息
      visibleInstall: false, // 安装卸载弹出框 显示隐藏
      isInstall: true, // 安装卸载弹出框  判断安装还是卸载
      valuesInstall: {}, // 安装卸载弹出框  传入参数
      gameName: ""
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getList = this.getList.bind(this);
    this.getGameList = this.getGameList.bind(this);
    this.getAppType = this.getAppType.bind(this);
    this.getClassify = this.getClassify.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onCancelInstall = this.onCancelInstall.bind(this);
    this.onChange = this.onChange.bind(this);
  }

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
      tableScroll: handleTableWidth(1600, 1800)
    });
  };
  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    selectApps(params)
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

  // 获取游戏列表
  getGameList = () => {
    const params = { size: 500 };
    selectGame(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          let arr = [];
          if (res.data.list && res.data.list.length > 0) {
            res.data.list.forEach(item => {
              arr.push({ game_id: item.game_id, game_name: item.game_name });
            });
          }

          this.setState({
            gameList: arr
          });
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

  // 根据游戏id获取所属平台
  getAppPlatform = gameId => {
    const params = {
      game_id: gameId,
      fields: "app_platform"
    };
    getGameInfo(params)
      .then(res => {
        const { code } = res;
        if (code === "00") {
          this.setState({ appPlatform: res.data.app_platform });
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
        apkUrl: ""
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
    this.getGameList();
  };

  // 编辑
  handleEdit = values => {
    // detailApp(values.app_id)
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(e => {
    //     console.error(e);
    //   });
    this.setState(
      {
        isEdit: true,
        visible: true,
        confirmLoading: false,
        values: Object.assign(this.state.values, values),
        game_info: Object.assign(this.state.game_info, values.game_info),
        apkUrl: values.resource_address
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
    console.log(this.state.values);
    this.getGameList();
  };

  // 上传安装包loading状态更改
  handleUploadLoading = loading => {
    this.setState({ loadingUploadApk: loading });
  };

  // 获取安装包地址
  handleSetApk = (apkUrl, loading) => {
    this.setState({ apkUrl: apkUrl, loadingUploadApk: loading });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    console.log("点击ok");
    delete this.state.searchParams.page;
    this.setState({
      confirmLoading: true
    });

    const params = values;

    params.app_size = Math.round(parseFloat(values.app_size) * 100) / 100;
    console.log(params);
    if (!isEdit) {
      addApps(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              apkUrl: "",
              values: {},
              game_info: {},
              appPlatform: undefined
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
      editApps(params.app_id, params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              apkUrl: "",
              values: {},
              game_info: {},
              appPlatform: undefined
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

  // 关闭弹出框
  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false,
      gameList: [],
      game_info: {},
      loadingUploadApk: false,
      apkUrl: "",
      appPlatform: undefined
    });
  };

  // ---------------------------------------------  安装卸载弹出框   -------------------------------------------------

  // 打开弹出框
  handleInstall = (isInstall, values) => {
    this.setState(
      {
        visibleInstall: true,
        isInstall: isInstall,
        valuesInstall: Object.assign(this.state.valuesInstall, values),
        gameName: values.game_info.game_name
      },
      () => {
        this.refs.GameschannelInstall.handleGetList();
      }
    );
    console.log(this.state.gameName);
  };

  // 关闭弹出框
  onCancelInstall = () => {
    console.log("Clicked cancel button");
    this.setState({
      visibleInstall: false
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------

  confirm = id => {
    delete this.state.searchParams.page;
    const params = id;
    deleteApp(params)
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
        // width: 80,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "APP ID",
        dataIndex: "app_id",
        key: "app_id"
        // width: 100
      },
      {
        title: "应用ID",
        dataIndex: "game_info.game_id",
        key: "game_info.game_id"
        // width: 100
      },
      {
        title: "应用名称",
        dataIndex: "game_info.game_name",
        key: "game_info.game_name"
        // width: 140
      },
      {
        title: "ROOT权限",
        key: "is_root",
        // width: 80,
        render: (text, record, index) => {
          return record.is_root ? "是" : "否";
        }
      },
      {
        title: "应用类型",
        dataIndex: "game_info.app_big_type",
        key: "game_info.app_big_type"
        // width: 100
      },
      {
        title: "分类",
        dataIndex: "game_info.app_small_type",
        key: "game_info.app_small_type"
        // width: 100
      },
      {
        title: "所属平台",
        dataIndex: "game_info.app_platform",
        key: "game_info.app_platform"
        // width: 120
      },
      {
        title: "应用包名",
        dataIndex: "package_name",
        key: "package_name",
        width: 150
      },
      {
        title: "厂商",
        dataIndex: "game_info.vendor",
        key: "game_info.vendor"
        // width: 100
      },
      {
        title: "渠道商",
        dataIndex: "channel_name",
        key: "channel_name"
        // width: 200
      },
      {
        title: "版本号",
        dataIndex: "version",
        key: "version"
        // width: 100
      },
      {
        title: "应用大小",
        dataIndex: "app_size",
        key: "app_size"
        // width: 100
      },
      {
        title: "应用上架状态",
        key: "game_info.shelf_status",
        // width: 100,
        render: (text, record, index) => {
          return record.game_info.shelf_status ? "上架" : "下架";
        }
      },
      {
        title: "渠道展示状态",
        key: "channel_show",
        // width: 100,
        render: (text, record, index) => {
          return record.channel_show ? "展示" : "隐藏";
        }
      },
      {
        title: "是否自动更新",
        key: "auto_update",
        // width: 100,
        render: (text, record, index) => {
          return record.auto_update ? "是" : "否";
        }
      },
      {
        title: "已安装数量",
        dataIndex: "install_device_count",
        key: "install_device_count"
        // width: 100
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
        width: 120,
        fixed: document.body.clientWidth <= 1600 ? "right" : "",
        render: (text, record) => {
          // console.log(text);
          // console.log(record);
          return (
            <div className="action">
              <a onClick={this.handleInstall.bind(this, true, record)}>安装</a>
              <a onClick={this.handleInstall.bind(this, false, record)}>卸载</a>
              <br />
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
              <Popconfirm
                title="你确定要删除吗"
                onConfirm={this.confirm.bind(this, record.app_id)}
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
        <h1>游戏渠道包管理</h1>
        <hr />

        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <GameschannelForm
          params={this.state.searchParams}
          dataType={this.state.dataType}
          dataClassify={this.state.dataClassify}
          onChangeDataType={this.getClassify}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="app_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
          scroll={this.state.tableScroll}
        />
        <GameschannelAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          game_info={this.state.game_info}
          apkUrl={this.state.apkUrl}
          handleSetApk={this.handleSetApk}
          handleUploadLoading={this.handleUploadLoading}
          loadingUploadApk={this.state.loadingUploadApk}
          appPlatform={this.state.appPlatform}
          getAppPlatform={this.getAppPlatform}
          gameList={this.state.gameList}
          onChangeDataType={this.getClassify}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        <GameschannelInstall
          ref="GameschannelInstall"
          visibleInstall={this.state.visibleInstall}
          isInstall={this.state.isInstall}
          valuesInstall={this.state.valuesInstall}
          gameName={this.state.gameName}
          onCancel={this.onCancelInstall}
        />
      </div>
    );
  }
}

export default Games;
