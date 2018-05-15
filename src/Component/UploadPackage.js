import React from "react";
import { Spin, Icon } from "antd";

class UploadPackage extends React.Component {
  loadApk = () => {
    let file = this.refs.inputfile.files[0];
    console.log(file);
    let formData = new FormData(); //初始化时将form Dom对象传入
    formData.append("apk", file);
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
          accept=".apk"
          onChange={this.loadApk}
        />
        {this.props.loadingUploadApk ? (
          <div>
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />}
            />
            &nbsp; 正在上传
          </div>
        ) : null}
        <p>{this.props.apkUrl}</p>
      </div>
    );
  }
}

export default UploadPackage;
