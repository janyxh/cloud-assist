import axios from "axios";
// import {Message} from "element-ui";
// import router from "../router";
import { message } from "antd";
import base from "./domain";

//设置默认请求头
axios.defaults.headers = {
  // "Content-Type": "application/x-www-form-urlencoded"
  'X-Requested-With': 'XMLHttpRequest'
};
// 带cookie请求
axios.defaults.withCredentials = true;

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
    }
    return res;
  },
  error => {
    //请求错误时做些事
    // console.error(error)
    return Promise.reject(error);
  }
);

// -------------------------------------------  菜单  -----------------------------------------------------

//登录-获取菜单
export const getMenu = params => {
  return axios.get(`./Json/nav.json`, { params: params }).then(res => res.data);
};

// -------------------------------------------  登录  -----------------------------------------------------

// 退出
export const checkLogin = params => {
  return axios
    .get(`${base}/user/checkLogin`, { params: params })
    .then(res => res.data);
};

// 退出
export const loginOut = params => {
  return axios
    .get(`${base}/user/loginOut`, { params: params })
    .then(res => res.data);
};

// -------------------------------------------  权限管理  -----------------------------------------------------

//获取用户列表
export const getUserList = params => {
  return axios
    .get(`${base}/user/getUserList`, { params: params })
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

// 新增游戏
export const addApps = params => {
  return axios.post(`${base}/apps`, params).then(res => res.data);
};

// 编辑游戏
export const editApps = (appId, params) => {
  return axios.put(`${base}/apps/${appId}`, params).then(res => res.data);
};

// 删除游戏
export const deleteApp = params => {
  return axios.delete(`${base}/apps/${params}`).then(res => res.data);
};

// 查询安装游戏列表
// export const selectOperations = params => {
//   return axios
//     .get(`${base}/apps/selectOperations`, { params: params })
//     .then(res => res.data);
// };

// 安装卸载游戏
export const appsAction = params => {
  return axios.post(`${base}/apps/${params}/action`).then(res => res.data);
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

// ------------------------------------------------- 示例 -------------------------------------------------------

//手机和邮箱的验证码
export const verificationNum = params => {
  return axios.post(`${base}/common/send/code`, params).then(res => res.data);
};

//登录-获取节能数据
export const getLoginEnergyData = params => {
  return axios
    .get(`${base}/ologin/save/energy`, { params: params })
    .then(res => res.data);
};
