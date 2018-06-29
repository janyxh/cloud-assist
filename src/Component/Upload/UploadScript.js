import React from "react";
import { selectAppId } from "../../api/api";
import { Spin, Icon, message } from "antd";

class UploadScript extends React.Component {
  loadScript = () => {
    let file = this.refs.inputfile.files[0];
    this.refs.inputfile.value = "";
    // console.log(file);
    let appID = this.props.appID;
    if (this.props.isEdit) {
      const params = this.props.handleCheckIsEdit();
      selectAppId(params)
        .then(res => {
          const { code } = res;
          if (code === "00") {
            this.upload(file, res.data.app_id);
          } else {
            message.error(res.message);
          }
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      this.upload(file, appID);
    }
  };

  // 上传
  upload = (file, appID) => {
    const isType = this.props.handleCheckType(file, appID);
    if (isType && appID) {
      let formData = new FormData(); //初始化时将form Dom对象传入
      formData.append("script", file);
      formData.append("childDir", appID);
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
            accept=".lua"
            title=" "
            onChange={this.loadScript}
          />
          <button>选择文件</button>
        </div>
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
