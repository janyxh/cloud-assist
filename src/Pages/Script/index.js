import React from "react";
import moment from "moment";
import ScriptForm from "../../Component/Script/Form";
import ScriptAdd from "../../Component/Script/Add";
import { Button, Table, message, Popconfirm } from "antd";
import {
  scripts,
  selectGame,
  selectChannelName,
  // getGameInfo,
  addScripts,
  editScripts,
  deleteScripts
} from "../../api/api";
import { getDurning, GetTimeOutput } from "../../Common";

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      data: [],
      gameList: [], // 游戏列表数组（新增用）
      channel_names: [], // 渠道商列表数组（新增用）
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
    this.getChannelNames = this.getChannelNames.bind(this);
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

  // 获取渠道商列表
  getChannelNames = id => {
    const params = {
      game_id: id
    };
    selectChannelName(params)
      .then(res => {
        this.setState({ loading: false });
        const { code } = res;
        if (code === "00") {
          this.setState({
            channel_names: res.data.channel_names || []
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
    delete this.state.searchParams.page;
    const gameParams = params;
    // 转换时间格式
    getDurning(gameParams, "created_at", "created_from", "created_to");
    getDurning(gameParams, "updated_at", "updated_from", "updated_to");
    this.setState(
      {
        searchParams: gameParams,
        loading: true
      },
      () => {
        this.getList(this.state.searchParams);
      }
    );
    console.log(this.state.searchParams);
  };

  // 重置
  handleReset = () => {
    this.setState({
      searchParams: {},
      loading: true,
      channel_names: []
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
        scriptUrl: ""
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
    // this.getChannelNames();
  };

  // 编辑
  handleEdit = values => {
    let option = [];
    if (values.script_options && values.script_options.length > 0) {
      values.script_options.forEach((item, index) => {
        option.push(item.option);
      });
    }
    console.log(option);
    this.setState(
      {
        isEdit: true,
        visible: true,
        values: Object.assign(this.state.values, values),
        scriptOptions: values.script_options,
        option: option,
        scriptUrl: values.resource_address
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

  // 上传安装包loading状态更改
  handleUploadLoading = loading => {
    this.setState({ loadingUploadScript: loading });
  };

  // 获取安装包地址
  handleSetScript = (scriptUrl, loading) => {
    this.setState({ scriptUrl: scriptUrl, loadingUploadScript: loading });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    delete this.state.searchParams.page;
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
      ScriptOption.push({ name: values[`name${i}`].trim(), option: [] });
      for (let j = 0; j < Number.POSITIVE_INFINITY; j++) {
        if (arrKeys.indexOf(`option${i}s${j}`) < 0) {
          break;
        }
        ScriptOption[i].option.push(values[`option${i}s${j}`].trim());
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
              scriptUrl: "",
              values: {},
              scriptOptions: [
                {
                  name: "",
                  option: [""]
                }
              ],
              option: [[""]]
            });
            message.success(res.message);
            this.getList(this.state.searchParams);
            fn && fn();
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
              values: {},
              scriptOptions: [
                {
                  name: "",
                  option: [""]
                }
              ],
              option: [[""]]
            });
            message.success(res.message);
            this.getList(this.state.searchParams);
            fn && fn();
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
    let newScriptOptions = JSON.parse(JSON.stringify(this.state.scriptOptions));
    newScriptOptions.push({ name: "", option: [""] });

    let newOption = JSON.parse(JSON.stringify(this.state.option));
    newOption.push([""]);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 减去脚本列表
  handleMinus = item => {
    let newScriptOptions = JSON.parse(JSON.stringify(this.state.scriptOptions));
    let num = newScriptOptions.indexOf(item);
    newScriptOptions.splice(num, 1);

    let newOption = JSON.parse(JSON.stringify(this.state.option));
    newOption.splice(newOption.indexOf(item), 1);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 添加配置项列表
  handleAddOption = index => {
    let newScriptOptions = JSON.parse(JSON.stringify(this.state.scriptOptions));
    newScriptOptions[index].option.push("");

    let newOption = JSON.parse(JSON.stringify(this.state.option));
    newOption[index].push("");

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };
  // 减去配置项列表
  handleMinusOption = (item, index) => {
    let newScriptOptions = JSON.parse(JSON.stringify(this.state.scriptOptions));
    let num = newScriptOptions[index].option.indexOf(item);
    newScriptOptions[index].option.splice(num, 1);

    let newOption = JSON.parse(JSON.stringify(this.state.option));
    newOption[index].splice(newOption[index].indexOf(item), 1);

    this.setState({
      scriptOptions: newScriptOptions,
      option: newOption
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------

  confirm = id => {
    delete this.state.searchParams.page;
    const params = id;
    deleteScripts(params)
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
        // fixed: "left",
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "脚本ID",
        dataIndex: "script_id",
        key: "script_id"
        // width: 80,
        // fixed: "left"
      },
      {
        title: "脚本名称",
        dataIndex: "script_name",
        key: "script_name"
      },
      {
        title: "脚本配置明细",
        key: "script_options",
        width: 150,
        render: (text, record) => {
          let scriptOptions = record.script_options;
          if (typeof scriptOptions === "string") {
            return false;
          }
          let option = "";
          if (scriptOptions.length === 0) {
            option = "";
          } else {
            if (scriptOptions && scriptOptions.length > 0) {
              scriptOptions.forEach((item, index) => {
                index === 0
                  ? (option += `[${item.name}：`)
                  : (option += `，[${item.name}：`);
                if (item.option && item.option.length > 0) {
                  item.option.forEach((itemOption, indexOP) => {
                    indexOP === 0
                      ? (option += `${itemOption}`)
                      : (option += `，${itemOption}`);
                  });
                }
                option += "]";
              });
            }
          }
          return option;
        }
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
        title: "好用度",
        dataIndex: "star_count",
        key: "star_count"
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
        width: 100,
        // fixed:"right",
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
          channel_names={this.state.channel_names}
          params={this.state.searchParams}
          onChangeGame={this.getChannelNames}
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
          // scroll={handleTableWidth(1366, 1600)}
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
          channel_names={this.state.channel_names}
          onChangeGame={this.getChannelNames}
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
