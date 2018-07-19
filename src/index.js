import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import RootRouter from "./router";
import App from "./App";

import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";

ReactDOM.render(
  <BrowserRouter>
    <LocaleProvider locale={zh_CN}>
      <App>
        <RootRouter />
      </App>
    </LocaleProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
