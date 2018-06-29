import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Pages/Login";
import Frame from "./Pages/Frame";
import Virtual from "./Pages/Device/Virtual";
import OTA from "./Pages/OTA";
import OTARecord from "./Pages/OTA/record";
import Games from "./Pages/Appstore/Games";
import Gameschannel from "./Pages/Appstore/Gameschannel";
import InstallRecord from "./Pages/Appstore/InstallRecord";
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
// import Test from "./Pages/Test/Test";
// import Test2 from "./Pages/Test/Test2";
// import Test3 from "./Pages/Test/Test3";
// import Test4 from "./Pages/Test/Test4";

class RootRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Frame>
          <Switch>
            <Route exact path="/Virtual" component={Virtual} />
            <Route path="/OTA" component={OTA} />
            <Route path="/OTARecord" component={OTARecord} />
            <Route path="/Games" component={Games} />
            <Route path="/Gameschannel" component={Gameschannel} />
            <Route path="/InstallRecord" component={InstallRecord} />
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
            {/* <Route path="/Test" component={Test} />
            <Route path="/Test2" component={Test2} />
            <Route path="/Test3" component={Test3} />
            <Route path="/Test4" component={Test4} /> */}
          </Switch>
        </Frame>
      </Switch>
    );
  }
}

export default RootRouter;
