import React from 'react';
import { Icon } from 'antd';

const CloudinaryFileUpload = ({ file, onUpload, onDelete }) => (
  <div className="couldinary">
    {file &&
      <div className="ant-upload-list ant-upload-list-picture-card">
        <div className="ant-upload-list-item ant-upload-list-item-done">
          <div className="ant-upload-list-item-info">
            <img className="couldinary-img" src={file} alt="profile" />
          </div>
          <div className="ant-upload-list-item-actions">
            <Icon type="delete" onClick={onDelete} />
          </div>
        </div>
      </div>
    }
    <div className="ant-upload ant-upload-select-picture-card" onClick={onUpload}>
      <span className="ant-upload">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </span>
    </div>
  </div>
)

export default CloudinaryFileUpload;
