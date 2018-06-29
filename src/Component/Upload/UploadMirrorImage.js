import React from "react";
import { Spin, Icon } from "antd";

class UploadPackage extends React.Component {
  loadApk = () => {
    let file = this.refs.inputfile.files[0];
    // console.log(file)
    const isType = this.props.handleCheckType(file);
    if (isType) {
      let formData = new FormData(); //初始化时将form Dom对象传入
      formData.append("mirrorImage", file);
      this.refs.inputfile.value='';
      this.props.handleUploadLoading(true);
      this.props.handleUpload(formData);
    }
  };

  render() {
    return (
      <div>
        <div className="upload-file-wrap">
          <input
            type="file"
            ref="inputfile"
            name="imagefile"
            accept=".zip"
            title=" "
            onChange={this.loadApk}
          />
          <button>选择文件</button>
        </div>
        {this.props.loadingUploadMirrorImage ? (
          <div>
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />}
            />
            &nbsp; 正在上传
          </div>
        ) : null}
        {/* <div>{this.props.mirrorImageUrl}</div> */}
      </div>
    );
  }
}

export default UploadPackage;
