import React from "react";
import moment from "moment";
import ScriptForm from "../../Component/Script/Form";
import ScriptAdd from "../../Component/Script/Add";
import { Button, Table, message, Popconfirm } from "antd";
import {
  scripts,
  selectGame,
  addScripts,
  editScripts,
  deleteScripts
} from "../../api/api";

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      data: [],
      gameList: [], // 游戏列表数组（新增用）
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
      values: {}, // 新增编辑弹出框 编辑时传入的参数
      scriptOptions: [
        {
          name: "",
          option: [""]
        }
      ],
      option: [[""]],
      loadingUploadScript: false, // 新增编辑弹出框  上传安装包时loading
      scriptUrl: "" // 新增编辑弹出框  安装包地址
    };
    this.getList = this.getList.bind(this);
    this.getGameList = this.getGameList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getList({});
    this.getGameList();
  }

  // ---------------------------------------------  获取列表   -------------------------------------------------

  // 获取列表
  getList = params => {
    scripts(params)
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

  // 获取游戏列表
  getGameList = params => {
    selectGame(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          let arr = [];
          // res.data.list.map(item => {
          //   arr.push(item.game_name);
          // });
          res.data.list.forEach(item => {
            arr.push({ game_id: item.game_id, game_name: item.game_name });
          });

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

  // ---------------------------------------------  搜索   -------------------------------------------------

  handelSearch = params => {
    const gameParams = params;
    // 转换时间格式
    if (gameParams && gameParams.created_at) {
      gameParams.createStartTime =
        moment(gameParams.created_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.createEndTime =
        moment(gameParams.created_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.created_at &&
      gameParams.createStartTime
    ) {
      gameParams.createStartTime = "";
      gameParams.createEndTime = "";
    }
    if (gameParams && gameParams.update_at) {
      gameParams.updateStartTime =
        moment(gameParams.update_at[0]).format("YYYY-MM-DD") + " 00:00:00";
      gameParams.updateEndTime =
        moment(gameParams.update_at[1]).format("YYYY-MM-DD") + " 23:59:59";
    } else if (
      gameParams &&
      !gameParams.update_at &&
      gameParams.updateStartTime
    ) {
      gameParams.updateStartTime = "";
      gameParams.updateEndTime = "";
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
      values: {},
      scriptUrl: ""
    });
    this.getGameList();
  };

  // 编辑
  handleEdit = values => {
    let option = [];
    values.script_options.forEach((item, index) => {
      option.push(item.option);
    });
    console.log(option);
    this.setState({
      isEdit: true,
      visible: true,
      values: Object.assign(this.state.values, values),
      scriptOptions: values.script_options,
      option: option,
      scriptUrl: values.resource_address
    });
    console.log(this.state.values);
    console.log(values.script_options.option);
    this.getGameList();
  };

  // 上传安装包loading状态更改
  handleUploadLoading = loading => {
    this.setState({ loadingUploadScript: loading });
  };

  // 获取安装包地址
  handleSetScript = (scriptUrl, loading) => {
    this.setState({ scriptUrl: scriptUrl, loadingUploadScript: loading });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit) => {
    console.log("点击ok");
    this.setState({
      confirmLoading: true
    });

    const params = values;

    // const name;
    // console.log(Object.keys("name"))

    const arrKeys = Object.keys(values);
    let ScriptOption = [];
    for (let i = 0; i < Number.POSITIVE_INFINITY; i++) {
      if (arrKeys.indexOf(`name${i}`) < 0) {
        break;
      }
      ScriptOption.push({ name: values[`name${i}`], option: [] });
      for (let j = 0; j < Number.POSITIVE_INFINITY; j++) {
        if (arrKeys.indexOf(`option${i}s${j}`) < 0) {
          break;
        }
        ScriptOption[i].option.push(values[`option${i}s${j}`]);
      }
    }

    // console.log(ScriptOption);
    params.script_options = ScriptOption;

    console.log(params);
    if (!isEdit) {
      addScripts(params)
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
          }
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      // params.game_id = this.state.values.game_id;

      editScripts(params, this.state.values.script_id)
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
      scriptOptions: [
        {
          name: "",
          option: [""]
        }
      ],
      option: [[""]]
    });
  };

  // 添加脚本列表
  handleAdd = () => {
    console.log("添加");

    let newScriptOptions = this.state.scriptOptions;
    newScriptOptions.push({ name: "", option: [""] });

    let newOption = this.state.option;
    newOption.push([""]);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 减去脚本列表
  handleMinus = item => {
    console.log("减去");
    let newScriptOptions = this.state.scriptOptions;
    newScriptOptions.splice(newScriptOptions.indexOf(item), 1);

    let newOption = this.state.option;
    newOption.splice(newOption.indexOf(item), 1);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 添加配置项列表
  handleAddOption = index => {
    console.log("添加配置项");

    let newScriptOptions = this.state.scriptOptions;
    newScriptOptions[index].option.push("");

    let newOption = this.state.option;
    newOption[index].push("");
    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 减去配置项列表
  handleMinusOption = (item, index) => {
    console.log("减去配置项");
    console.log("item/" + item);
    console.log(item);

    let newScriptOptions = this.state.scriptOptions;
    newScriptOptions[index].option.splice(
      newScriptOptions[index].option.indexOf(item),
      1
    );

    let newOption = this.state.option;
    newOption[index].splice(newOption[index].indexOf(item), 1);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------

  confirm = id => {
    const params = id;
    deleteScripts(params)
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
        title: "脚本ID",
        dataIndex: "script_id",
        key: "script_id"
      },
      {
        title: "脚本名称",
        dataIndex: "script_name",
        key: "script_name"
      },
      {
        title: "资源地址",
        dataIndex: "resource_address",
        key: "resource_address"
      },
      {
        title: "所属游戏",
        dataIndex: "game_name",
        key: "game_name"
      },
      {
        title: "所属渠道商",
        dataIndex: "channel_name",
        key: "channel_name"
      },
      {
        title: "上架状态",
        key: "shelf_status",
        render: (text, record) => {
          return record.shelf_status ? "上架" : "下架";
        }
      },
      {
        title: "创建时间",
        key: "created_at",
        width: 110,
        render: (text, record, index) => {
          return moment(record.created_at).format("YYYY-MM-DD hh:mm:ss");
        }
      },
      {
        title: "更新时间",
        key: "updated_at",
        width: 110,
        render: (text, record, index) => {
          return moment(record.created_at).format("YYYY-MM-DD hh:mm:ss");
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
                onConfirm={this.confirm.bind(this, record.script_id)}
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
        <h1>脚本管理</h1>
        <hr />

        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <ScriptForm
          gameList={this.state.gameList}
          params={this.state.searchParams}
          handelSearch={this.handelSearch}
          handleReset={this.handleReset}
        />
        <Table
          className="table-padding"
          rowKey="script_id"
          loading={this.state.loading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
        />
        <ScriptAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          scriptOptions={this.state.scriptOptions}
          option={this.state.option}
          scriptUrl={this.state.scriptUrl}
          handleSetScript={this.handleSetScript}
          handleUploadLoading={this.handleUploadLoading}
          loadingUploadScript={this.state.loadingUploadScript}
          gameList={this.state.gameList}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleAdd={this.handleAdd}
          handleMinus={this.handleMinus}
          handleAddOption={this.handleAddOption}
          handleMinusOption={this.handleMinusOption}
        />
      </div>
    );
  }
}

export default Task;
