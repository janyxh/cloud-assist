import React from "react";
import moment from "moment";
import OTAForm from "../../Component/OTA/OTA/Form";
import OTAAdd from "../../Component/OTA/OTA/Add";
import OTAUpgrade from "../../Component/OTA/OTA/Upgrade";
import { Button, Table, message, Popconfirm } from "antd";
import {
  getMirrorImageList,
  addMirrorImage,
  updateMirrorImage,
  deleteMirrorImage
} from "../../api/api";
import { getDurning, GetTimeOutput } from "../../Common";

class OTA extends React.Component {
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
      values: {}, // 新增编辑弹出框 编辑时传入的参数,
      loadingUploadMirrorImage: false, // 新增编辑弹出框  上传镜像包时loading
      mirrorImageUrl: "", // 新增编辑弹出框  镜像包地址
      visibleUpgrade: false // 升级弹出框 loading
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
    getMirrorImageList(params)
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
    this.setState({ loading: true });
    delete this.state.searchParams.page;
    const gameParams = params;
    // 转换时间格式
    getDurning(gameParams, "created_at", "createStartTime", "createEndTime");
    getDurning(gameParams, "updated_at", "updateStartTime", "updateEndTime");

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
        values: {},
        mirrorImageUrl: ""
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
        values: Object.assign(this.state.values, values),
        mirrorImageUrl: values.ftpPath
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

  // 上传安装包loading状态更改
  handleUploadLoading = loading => {
    this.setState({ loadingUploadMirrorImage: loading });
  };

  // 获取安装包地址
  handleSetMirrorImage = (mirrorImageUrl, loading) => {
    this.setState({
      mirrorImageUrl: mirrorImageUrl,
      loadingUploadMirrorImage: loading
    });
  };

  // 点击弹出框的确定
  handleOk = (values, isEdit, fn) => {
    delete this.state.searchParams.page;
    this.setState({
      confirmLoading: true
    });
    const params = values;
    delete params.resource_address;
    if (!isEdit) {
      addMirrorImage(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              values: {},
              mirrorImageUrl: ""
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
      params.id = this.state.values.id;
      updateMirrorImage(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.setState({
              visible: false,
              confirmLoading: false,
              apkUrl: "",
              values: {}
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
    this.setState({
      visible: false,
      loadingUploadMirrorImage: false,
      apkUrl: ""
    });
  };

  // ---------------------------------------------  升级弹出框   -------------------------------------------------

  // 打开弹出框
  showModalUpgrade = values => {
    this.setState(
      {
        visibleUpgrade: true,
        values: values
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
    this.refs.OTAUpgrade.handleGetList();
  };

  // 关闭弹出框
  handleCancelUpgrade = () => {
    this.setState({
      visibleUpgrade: false
      // values: {}
    });
  };

  // ---------------------------------------------  删除   -------------------------------------------------
  // 删除
  confirm = id => {
    delete this.state.searchParams.page;
    const params = {
      id: id
    };
    deleteMirrorImage(params)
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
        title: "镜像ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "镜像名称",
        dataIndex: "imageName",
        key: "imageName"
      },
      {
        title: "安卓版本号",
        dataIndex: "androidVersion",
        key: "androidVersion"
      },
      {
        title: "内部版本号",
        dataIndex: "maintainVersion",
        key: "maintainVersion"
      },
      {
        title: "镜像包大小(MB)",
        dataIndex: "imageSize",
        key: "imageSize"
      },
      {
        title: "资源路径",
        dataIndex: "ftpPath",
        key: "ftpPath",
        width: 150
      },
      {
        title: "备注",
        dataIndex: "memo",
        key: "memo"
      },
      {
        title: "创建时间",
        key: "createTime",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.createTime);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "更新时间",
        key: "updateTime",
        width: 110,
        render: (text, record, index) => {
          let time = GetTimeOutput(record.updateTime);
          time = moment(time).format("YYYY-MM-DD HH:mm:ss");
          return time;
        }
      },
      {
        title: "操作",
        key: "action",
        width: 140,
        render: (text, record) => {
          return (
            <div className="action">
              <a onClick={this.showModalUpgrade.bind(this, record)}>OTA升级</a>
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
              <br />
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
        <h1>镜像包管理</h1>
        <hr />

        <div className="btns-operation">
          <Button onClick={this.showModal}>新增</Button>
        </div>
        <OTAForm
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
        <OTAAdd
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          isEdit={this.state.isEdit}
          values={this.state.values}
          loadingUploadMirrorImage={this.state.loadingUploadMirrorImage}
          handleUploadLoading={this.handleUploadLoading}
          mirrorImageUrl={this.state.mirrorImageUrl}
          handleSetMirrorImage={this.handleSetMirrorImage}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        <OTAUpgrade
          ref="OTAUpgrade"
          visibleUpgrade={this.state.visibleUpgrade}
          values={this.state.values}
          onCancelUpgrade={this.handleCancelUpgrade}
        />
      </div>
    );
  }
}

export default OTA;
