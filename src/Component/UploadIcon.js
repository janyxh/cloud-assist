import React from "react";
import { Icon } from "antd";

class UploadIcon extends React.Component {
  loadImg = () => {
    let file = this.refs.inputfile.files[0];
    let formData = new FormData(); //初始化时将form Dom对象传入
    formData.append("iconFile", file);
    this.props.handleUpload(formData, file);
  };

  render() {
    const {imgUrl} = this.props;
    return (
      <div className="upload-wrap">
        <div>
          <Icon type="plus" />
          <input
            type="file"
            ref="inputfile"
            name="imagefile"
            accept="image/jpeg, image/jpg"
            onChange={this.loadImg}
          />
        </div>
        <img src={imgUrl} alt="图" />
      </div>
    );
  }
}

export default UploadIcon;
