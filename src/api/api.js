import axios from "axios";
// import {Message} from "element-ui";
// import router from "../router";
import base from "./domain";
import { message } from "antd";
// import time from "../Common/timeout";

//设置默认请求头
// axios.defaults.headers = {
//   "X-Requested-With": "XMLHttpRequest"
// };
// 带cookie请求
axios.defaults.withCredentials = true;
// axios.defaults.timeout = time;

//添加响应拦截器
axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    // console.log(res);
    // console.log(res.data)
    if (res.data.code === "11") {
      // message.error(res.data.message);
      setTimeout(() => {
        // this.props.history.push("/");
        // this.props.history.push("/");
        window.location.href = "/";
      }, 1000);
    } else if (res.data.code === 500) {
      // Message.error(res.data.msg);
      message.error(res.data.msg);
    } else if (res.data.code === 502) {
      // Message.error(res.data.msg);
      message.error("系统繁忙，请稍后重试");
    }
    return res;
  },
  error => {
    //请求错误时做些事
    // console.log(error);
    // console.log(error.response);
    // console.log(error.request);
    // console.log(error.request.status);
    // console.log(error.request.readyState);
    // console.log(error.request.ontimeout);
    // if (
    //   error.request.readyState === 4 &&
    //   (error.request.status === 0 || error.request.status !== 200)
    // ) {
    //   //我在这里重新请求
    //   message.error("请求超时，请稍后重试");
    // }
    // message.error("请求超时，请稍后重试");

    return Promise.reject(error);
  }
);

// -------------------------------------------  菜单  -----------------------------------------------------

//登录-获取菜单
export const getMenu = params => {
  return axios.get(`./Json/nav.json`, { params: params }).then(res => res.data);
};

// -------------------------------------------  登录  -----------------------------------------------------
// function obj2String(obj) {
//   let arrKeys = Object.keys(obj);
//   let str = "";
//   arrKeys.forEach((item, index) => {
//     index > 0
//       ? (str += `&${item}=${obj[item]}`)
//       : (str += `${item}=${obj[item]}`);
//   });
//   return str;
// }

// 登录
export const checkLogin = params => {
  return axios
    .get(`${base}/user/checkLogin`, { params: params })
    .then(res => res.data);
  // const searchStr = obj2String(params);
  // return {
  //   url: `${base}/user/checkLogin?${searchStr}`
  // };
};

// 退出
export const loginOut = params => {
  return axios
    .get(`${base}/user/loginOut`, { params: params })
    .then(res => res.data);
};

// -------------------------------------------  用户管理  -----------------------------------------------------

// 获取用户列表
export const getUserList = params => {
  return axios
    .get(`${base}/user/getUserList`, { params: params })
    .then(res => res.data);
};

// 添加用户
export const addCloudUser = params => {
  return axios.post(`${base}/user/addCloudUser`, params).then(res => res.data);
};

// 编辑用户
export const modifyCloudUser = params => {
  return axios
    .post(`${base}/user/modifyCloudUser`, params)
    .then(res => res.data);
};

// 删除用户
export const deleteCloudUser = params => {
  return axios
    .post(`${base}/user/deleteCloudUser`, params)
    .then(res => res.data);
};

// 修改密码
export const modifyPassword = params => {
  return axios
    .post(`${base}/user/modifyPassword`, params)
    .then(res => res.data);
};
// -------------------------------------------  虚拟机管理  -----------------------------------------------------

// 获取虚拟机列表
export const servers = params => {
  return axios.get(`${base}/servers`, { params: params }).then(res => res.data);
};

// 虚拟机重启,重置接口
export const serversAction = (serverId, params) => {
  return axios
    .post(`${base}/servers/${serverId}/action`, params)
    .then(res => res.data);
};

// 查看设备操作日志
export const operations = (serverId, params) => {
  return axios
    .get(`${base}/servers/${serverId}/operations`, { params: params })
    .then(res => res.data);
};

// 查看设备信息接口
export const device = serverId => {
  return axios.get(`${base}/servers/${serverId}/device`).then(res => res.data);
};

// 编辑云手机
export const editServers = (server_id, params) => {
  return axios
    .put(`${base}/servers/${server_id}`, params)
    .then(res => res.data);
};

// 连接云手机
export const connect = params => {
  return axios.post(`${base}/servers/connect`, params).then(res => res.data);
};

// -------------------------------------------  OTA升级  -----------------------------------------------------

// 获取镜像包信息列表
export const getMirrorImageList = params => {
  return axios
    .get(`${base}/mirrorImage/getMirrorImageList`, { params: params })
    .then(res => res.data);
};

// 添加镜像包信息
export const addMirrorImage = params => {
  return axios
    .post(`${base}/mirrorImage/addMirrorImage`, params)
    .then(res => res.data);
};

// 修改镜像包信息
export const updateMirrorImage = params => {
  return axios
    .post(`${base}/mirrorImage/updateMirrorImage`, params)
    .then(res => res.data);
};

// 删除镜像包
export const deleteMirrorImage = params => {
  return axios
    .post(`${base}/mirrorImage/deleteMirrorImage`, params)
    .then(res => res.data);
};

// OTA镜像升级
export const upgrade = params => {
  return axios
    .post(`${base}/otaPackages/upgrade`, params)
    .then(res => res.data);
};

// -------------------------------------------  OTA升级记录  -----------------------------------------------------

// 获取OTA升级记录列表
export const selectPackages = params => {
  return axios
    .get(`${base}/otaPackages/selectPackages`, { params: params })
    .then(res => res.data);
};

// 查看OTA升级记录详情
export const detailPackage = (upgradeId, params) => {
  return axios
    .get(`${base}/otaPackages/detail/${upgradeId}`, { params: params })
    .then(res => res.data);
};

// -------------------------------------------  游戏管理  -----------------------------------------------------

// 获取游戏管理列表
export const selectGame = params => {
  return axios
    .get(`${base}/game/selectGame`, { params: params })
    .then(res => res.data);
};

// 应用类型数字字典
// 获取应用类型
export const getAppTypeList = params => {
  return axios
    .get(`${base}/appTypeDictionary/getAppTypeList`, { params: params })
    .then(res => res.data);
};

// 获取分类
export const getClassifyList = params => {
  return axios
    .get(`${base}/appTypeDictionary/getClassifyList`, { params: params })
    .then(res => res.data);
};

// 根据游戏id获取所属平台,渠道商，游戏名称
export const getGameInfo = params => {
  return axios
    .get(`${base}/game/selectChannelName`, { params: params })
    .then(res => res.data);
};

// 根据游戏id和渠道名字获取对应的游戏渠道包(app_id)
export const selectAppId = params => {
  return axios
    .get(`${base}/game/selectAppId`, { params: params })
    .then(res => res.data);
};

// 新增游戏
export const addGame = params => {
  return axios.post(`${base}/game/addGame`, params).then(res => res.data);
};

// 编辑游戏
export const modifyGame = params => {
  return axios.put(`${base}/game/modifyGame`, params).then(res => res.data);
};

// 删除游戏
export const deleteGame = params => {
  return axios
    .delete(`${base}/game/deleteGame`, { params: params })
    .then(res => res.data);
};

// -------------------------------------------  游戏渠道包管理  -----------------------------------------------------

// 获取游戏渠道包列表
export const selectApps = params => {
  return axios
    .get(`${base}/apps/selectApps`, { params: params })
    .then(res => res.data);
};

// 新增游戏渠道包
export const addApps = params => {
  return axios.post(`${base}/apps`, params).then(res => res.data);
};

// 编辑游戏渠道包
export const editApps = (appId, params) => {
  return axios.put(`${base}/apps/${appId}`, params).then(res => res.data);
};

// 删除游戏渠道包
export const deleteApp = params => {
  return axios.delete(`${base}/apps/${params}`).then(res => res.data);
};

// 查看渠道包详情
export const detailApp = id => {
  return axios.get(`${base}/apps/${id}`).then(res => res.data);
};

// 对渠道包进行批量操作，包括安装，卸载
export const batchAction = (appId, params) => {
  return axios
    .post(`${base}/apps/batch_action/${appId}`, params)
    .then(res => res.data);
};

// -------------------------------------------  安装卸载任务  -----------------------------------------------------

// 查询安装卸载任务列表
export const selectOperations = params => {
  return axios
    .get(`${base}/apps/selectOperations`, { params: params })
    .then(res => res.data);
};

// 查看安装卸载任务明细
export const batchActionDetail = (batchActionDetailId, params) => {
  return axios
    .get(`${base}/apps/batchActionDetail/${batchActionDetailId}`, {
      params: params
    })
    .then(res => res.data);
};

// ----------------------------------------------  充值订单管理  -------------------------------------------------------

// 获取充值订单列表
export const queryOrder = params => {
  return axios
    .get(`${base}/order/queryOrder`, { params: params })
    .then(res => res.data);
};

// ----------------------------------------------  用户管理  -------------------------------------------------------

// 获取App用户列表
export const selectAppUsers = params => {
  return axios
    .post(`${base}/appUser/selectAppUsers`, params)
    .then(res => res.data);
};

// ----------------------------------------------  资金管理  -------------------------------------------------------

// 获取资金列表
export const queryFunds = params => {
  return axios
    .get(`${base}/funds/queryFunds`, { params: params })
    .then(res => res.data);
};

// ----------------------------------------------  任务单管理  -------------------------------------------------------

// 获取任务单列表
export const tasks = params => {
  return axios.get(`${base}/tasks`, { params: params }).then(res => res.data);
};

// ----------------------------------------------  脚本管理  -------------------------------------------------------

// 获取脚本列表
export const scripts = params => {
  return axios.get(`${base}/scripts`, { params: params }).then(res => res.data);
  // return axios.get(`./Json/script.json`, { params: params }).then(res => res.data);
};

// 新增脚本
export const addScripts = params => {
  return axios.post(`${base}/scripts`, params).then(res => res.data);
};

// 编辑脚本
export const editScripts = (params, id) => {
  return axios.put(`${base}/scripts/${id}`, params).then(res => res.data);
};

// 删除脚本
export const deleteScripts = params => {
  return axios.delete(`${base}/scripts/${params}`).then(res => res.data);
};

// 获取渠道商列表
export const selectChannelName = params => {
  return axios
    .get(`${base}/game/selectChannelName`, { params: params })
    .then(res => res.data);
};
// ----------------------------------------------  商品管理  -------------------------------------------------------

// 获取商品列表
export const queryGamePoint = params => {
  return axios
    .get(`${base}/gamePoint/queryGamePoint`, { params: params })
    .then(res => res.data);
};

// 新增商品
export const addGamePoint = params => {
  return axios
    .post(`${base}/gamePoint/addGamePoint`, params)
    .then(res => res.data);
};

// 编辑商品
export const updateGamePoint = params => {
  return axios
    .put(`${base}/gamePoint/updateGamePoint`, params)
    .then(res => res.data);
};

// 删除商品
export const delGamePoint = params => {
  return axios
    .delete(`${base}/gamePoint/delGamePoint`, { params: params })
    .then(res => res.data);
};

// ----------------------------------------------  上传文件  -------------------------------------------------------

// 图标上传阿里云
export const uploadIcon = params => {
  return axios.post(`${base}/upload/uploadIcon`, params).then(res => res.data);
};

// 渠道包解析与上传阿里云
export const uploadApk = params => {
  return axios.post(`${base}/upload/uploadApk`, params).then(res => res.data);
};

// 脚本解析与脚本文件上传
export const uploadScript = params => {
  return axios
    .post(`${base}/upload/uploadScript`, params)
    .then(res => res.data);
};

// 镜像包解析与镜像包文件上传
export const uploadMirrorImage = params => {
  return axios
    .post(`${base}/upload/uploadMirrorImage`, params)
    .then(res => res.data);
};

// 删除ftp服务器上的文件
export const deleteFile = params => {
  return axios.post(`${base}/upload/deleteFile`, params).then(res => res.data);
};
