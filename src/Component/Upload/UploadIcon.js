import React from "react";
import { Icon, Spin } from "antd";

class UploadIcon extends React.Component {
  loadImg = () => {
    const file = this.refs.inputfile.files[0];
    // console.log(file);
    const isType = this.props.handleCheckType(file);
    if (isType) {
      let formData = new FormData(); //初始化时将form Dom对象传入
      formData.append("iconFile", file);
      this.refs.inputfile.value = "";
      this.props.handleUpload(formData);
    }
  };

  render() {
    const { imgUrl } = this.props;
    return (
      <div>
        <div className="upload-wrap">
          <div>
            <Icon type="plus" />
            <input
              type="file"
              ref="inputfile"
              name="imagefile"
              title=" "
              accept="image/jpeg, image/jpg, image/png, image/gif, image/bmp"
              onChange={this.loadImg}
            />
          </div>
          <img src={imgUrl} alt={imgUrl && "图"} />
        </div>
        {this.props.loadingUploadIcon ? (
          <div>
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />}
            />
            &nbsp; 正在上传
          </div>
        ) : null}
        {!imgUrl && this.props.defaultTip ? <div>请上传100K以内的jpg,png,gif,bmp格式的图片</div> : ""}
      </div>
    );
  }
}

export default UploadIcon;
