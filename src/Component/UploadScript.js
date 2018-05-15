import React from "react";
import { Spin, Icon } from "antd";

class UploadScript extends React.Component {
  loadScript = () => {
    let file = this.refs.inputfile.files[0];
    console.log(file);
    let formData = new FormData(); //初始化时将form Dom对象传入
    formData.append("script", file);
    this.props.handleUploadLoading(true);
    this.props.handleUpload(formData);
  };

  render() {
    return (
      <div>
        <input
          type="file"
          ref="inputfile"
          name="imagefile"
          accept=".lua"
          onChange={this.loadScript}
        />
        {this.props.loadingUploadScript ? (
          <div>
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />}
            />
            &nbsp; 正在上传
          </div>
        ) : null}
        <div>{this.props.scriptUrl}</div>
      </div>
    );
  }
}

export default UploadScript;
