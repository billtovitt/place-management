import React from 'react';
import { Icon, Tag, Input } from 'antd';

const CustomTags = ({ isCreating, onChange, onUpdate, onClick, tags, onDelete }) => {
  const customTags = tags.map(tag =>
    <Tag key={tag} closable afterClose={() => onDelete(tag)}>
      {tag}
    </Tag>
  );

  return (
    <div className="tag-wrapper">
      {customTags}
      {isCreating && (
        <Input
          autoFocus
          size="small"
          style={{ width: 78 }}
          onChange={onChange}
          onBlur={onUpdate}
          onPressEnter={onUpdate}
        />
      )}
      {!isCreating &&
        <Tag className="button-new-tag" onClick={onClick}>
          <Icon type="plus" /> New Tag
        </Tag>
      }
    </div>
  );
}

export default CustomTags;
