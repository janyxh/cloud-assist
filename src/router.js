import React from "react";
import { Route, Switch } from "react-router-dom";
// import { getMenu } from "../api/api";
import Login from "./Pages/Login";
import Frame from "./Pages/Frame";
// import Test from "./Pages/Test";
import Virtual from "./Pages/Device/Virtual";
import Games from "./Pages/Appstore/Games";
import Gameschannel from "./Pages/Appstore/Gameschannel";
import Goods from "./Pages/Goods";
import Task from "./Pages/Task";
import Recharge from "./Pages/Recharge";
import Problem from "./Pages/Problem";
import Appusers from "./Pages/Appusers/Appusers";
import Feedback from "./Pages/Appusers/Feedback";
import Capital from "./Pages/Capital";
import Script from "./Pages/Script";
import User from "./Pages/Auth/User";
import Role from "./Pages/Auth/Role";
import Authority from "./Pages/Auth/Authority";

class RootRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Frame>
          <Switch>
            {/* <Route exact path="/Test" component={Test} /> */}
            <Route exact path="/Virtual" component={Virtual} />
            <Route path="/Games" component={Games} />
            <Route path="/Gameschannel" component={Gameschannel} />
            <Route path="/Goods" component={Goods} />
            <Route path="/Task" component={Task} />
            <Route path="/Recharge" component={Recharge} />
            <Route path="/Problem" component={Problem} />
            <Route path="/Appusers" component={Appusers} />
            <Route path="/Feedback" component={Feedback} />
            <Route path="/Capital" component={Capital} />
            <Route path="/Script" component={Script} />
            <Route path="/User" component={User} />
            <Route path="/Role" component={Role} />
            <Route path="/Authority" component={Authority} />
          </Switch>
        </Frame>
      </Switch>
    );
  }
}

export default RootRouter;
