import moment from "moment";
import time from "./timeout";

// 入参时间转东八区-8小时
export const GetTimeInput = strTime => {
  var time = strTime;
  time = time.replace(/-/g, ":").replace(" ", ":");
  time = time.split(":");
  var time1 = new Date(
    time[0],
    time[1] - 1,
    time[2],
    time[3],
    time[4],
    time[5]
  );
  time1 = time1.setHours(time1.getHours() - 8);
  return time1;
};

// 出参时间转东八区+8小时
export const GetTimeOutput = strTime => {
  var time = strTime;
  time = time.replace(/-/g, ":").replace(" ", ":");
  time = time.split(":");
  var time1 = new Date(
    time[0],
    time[1] - 1,
    time[2],
    time[3],
    time[4],
    time[5]
  );
  time1 = time1.setHours(time1.getHours() + 8);
  return time1;
};

// 禁用时间
export const disabledDate = current => {
  // Can not select days before today and today
  return current && current > moment().endOf("day");
};

// 转换时间区间
export const getDurning = (gameParams, timeList, timeFrom, timeTo) => {
  if (gameParams && gameParams[timeList] && gameParams[timeList].length > 0) {
    gameParams[timeFrom] =
      moment(gameParams[timeList][0]).format("YYYY-MM-DD") + " 00:00:00";
    gameParams[timeFrom] = moment(GetTimeInput(gameParams[timeFrom])).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    gameParams[timeTo] =
      moment(gameParams[timeList][1]).format("YYYY-MM-DD") + " 23:59:59";
    gameParams[timeTo] = moment(GetTimeInput(gameParams[timeTo])).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  } else if (gameParams && !gameParams[timeList] && gameParams[timeFrom]) {
    gameParams[timeFrom] = "";
    gameParams[timeTo] = "";
  }

  delete gameParams[timeList];
  return gameParams;
};

// table适配
export const handleTableWidth = (width, tablewidth) => {
  const obj = document.body.clientWidth <= width ? { x: tablewidth } : {};
  return obj;
};

// http请求超时时处理
export const handleTimeout = fn => {
  setTimeout(() => {
    fn && fn();
  }, time);
};
