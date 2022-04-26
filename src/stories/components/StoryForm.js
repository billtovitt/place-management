import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Row, Col, Alert } from 'antd';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  renderInput,
  renderSelect,
  renderLabel,
  renderTextarea,
} from '../../shared/utils/form_components';
import { required } from '../../shared/utils/form_validations';
import { STORY_STATUS } from '../../shared/constants/constants';
import CustomTags from './CustomTags';
import CloudinaryFilesUpload from '../../shared/components/CloudinaryFilesUpload';

const FormItem = Form.Item;

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class StoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.hashtags || [],
      newTag: null,
      files: props.pictureURL || [],
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
    this.handleDeletePicture = this.handleDeletePicture.bind(this);
    this.handleUploadWidget = this.handleUploadWidget.bind(this);
  }

  handleDeletePicture(pictureFile) {
    const files = this.state.files.filter(file => file != pictureFile);
    this.setState({ files });
  }

  handleUploadWidget() {
    window.cloudinary.openUploadWidget(
      { cloud_name: 'onemap-co', upload_preset: 'bztfvbid', tags: ['xmas'] },
      (err, result) => {
        if (result) {
          const files = result.map(res => res.secure_url).concat(this.state.files);
          this.setState({ files });
        }
      }
    );
  }

  onSubmit(values) {
    const { files, tags } = this.state;
    return this.props.onSubmit({ ...values, hashtag: tags, pictureURL: files });
  }

  handleDeleteTag = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag != removedTag);
    this.setState({ tags });
  }

  handleUpdateTags = () => {
    const { newTag, tags } = this.state;
    const newTags = _.uniq(tags.concat(newTag))
    this.setState({ tags: newTags, newTag: null });
  }

  render() {
    const { handleSubmit, error, submitting, places, users, createdAt, onDelete } = this.props;
    const { tags, newTag } = this.state;
    const placeOptions = places.map(({ id, placeName }) => ({ value: id, label: placeName }));
    const userOptions = users.map(({ id, displayName }) => ({ value: id, label: displayName }));

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <Row>
          <div className="is-right">
            <FormItem>
              <Button style={{ marginRight: 5 }}>
                <Link to="/stories">Cancel</Link>
              </Button>
              {onDelete &&
                <Button type="danger" ghost onClick={onDelete} style={{ marginRight: 5 }}>
                  Delete
                </Button>
              }
              <Button loading={submitting} type="primary" htmlType="submit">Save</Button>
            </FormItem>
          </div>
        </Row>

        {error && <Row><FormItem><Alert message={error} type="error" closable /></FormItem></Row>}

        <Row gutter={32}>
          <Col span={8}>
            <Field
              name="createdById"
              label="User Name"
              component={renderSelect}
              placeholder="Select User Name"
              options={userOptions}
              validate={required}
            />

            <Field
              name="placeId"
              label="Place Name"
              component={renderSelect}
              placeholder="Select Place Name"
              options={placeOptions}
              validate={required}
            />

            <Field
              name="status"
              label="Story Status"
              component={renderSelect}
              placeholder="Select Status"
              options={STORY_STATUS}
              validate={required}
            />

            <Field
              name="title"
              label="Story Title"
              component={renderInput}
              placeholder="Story Title"
              validate={required}
            />

            <Field
              name="story"
              label="Story"
              component={renderTextarea}
              placeholder="User Place Story"
            />

            <FormItem {...tailFormItemLayout}>
              <CustomTags
                tags={tags}
                isCreating={newTag != null}
                onChange={(e) => this.setState({ newTag: e.target.value })}
                onUpdate={this.handleUpdateTags}
                onDelete={this.handleDeleteTag}
                onClick={() => this.setState({ newTag: '' })}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Story Picture</label>
              </Col>
              <Col span={16}>
                <CloudinaryFilesUpload
                  files={this.state.files}
                  onUpload={this.handleUploadWidget}
                  onDelete={(file) => this.handleDeletePicture(file)}
                />
              </Col>
            </FormItem>

            {createdAt &&
              <Field
                name="createdAt"
                label="Create Date"
                component={renderLabel}
              />
            }
          </Col>
        </Row>
      </Form>
    )
  }
}

const Story = reduxForm({ form: 'storyForm' })(StoryForm);

const selector = formValueSelector('storyForm');

export default connect(
  state => ({
    createdAt: selector(state, 'createdAt'),
  }),
)(Story);
