import React from "react";
import Left from "../Component/Left";

class Frame extends React.Component {
  render() {
    return (
      <div className="frame">
        <Left />
        <section ref="section">
          <div className="content">{this.props.children}</div>
        </section>
      </div>
    );
  }
}

export default Frame;
