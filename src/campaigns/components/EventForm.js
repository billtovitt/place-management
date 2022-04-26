import React, { Component } from 'react';
import { Form, Button, Icon, Row, Col, Input, Alert } from 'antd';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  renderInput,
  renderTextarea,
  renderSwitch,
  renderDateTime,
} from '../../shared/utils/form_components';
import { required } from '../../shared/utils/form_validations';
import CustomTags from '../../stories/components/CustomTags';
import CloudinaryFileUpload from '../../shared/components/CloudinaryFileUpload';

const FormItem = Form.Item;

class EventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      file: props.feedNotificationImg || null,
      availableCities: [],
      newTag: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
    this.handleUploadWidget = this.handleUploadWidget.bind(this);
  }

  onSubmit(values) {
    return this.props.onSubmit({
      ...values,
      availableCities: this.state.tags,
      feedNotificationImg: this.state.file,
    });
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

  handleUploadWidget() {
    window.cloudinary.openUploadWidget(
      { cloud_name: 'onemap-co', upload_preset: 'bztfvbid', tags: ['xmas'] },
      (err, result) => result && this.setState({ file: result[0].secure_url })
    );
  }

  render() {
    const { handleSubmit, error, submitting, onDelete } = this.props;
    const { tags, newTag } = this.state;

    return (
      <Form layout="vertical" onSubmit={handleSubmit(this.onSubmit)}>
        <Row>
          <div className="is-right">
            <FormItem>
              <Button style={{ marginRight: 5 }}>
                <Link to="/campaigns/">Cancel</Link>
              </Button>
              {onDelete &&
                <Button type="danger" ghost onClick={onDelete} style={{ marginRight: 5 }}>
                  Delete
                </Button>
              }
              <Button type="primary" loading={submitting} htmlType="submit">
                Save
              </Button>
            </FormItem>
          </div>
        </Row>

        {error && <Row><FormItem><Alert message={error} type="error" closable /></FormItem></Row>}

        <Row gutter={32}>
          <Col span={12}>
            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Event Name</label>
              </Col>
              <Col span={10}>
                <Field
                  name="name"
                  component={renderInput}
                  placeholder="Event Name"
                  validate={required}
                />
              </Col>
              <Col span={6} className="custom-switch">
                <Field
                  name="active"
                  label="Active"
                  component={renderSwitch}
                />
              </Col>
            </FormItem>

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Available in Cities</label>
              </Col>
              <Col span={16}>
                <FormItem>
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
            </FormItem>

            <Field
              name="description"
              label="Event Description"
              component={renderTextarea}
              placeholder="Event Description"
            />

            <Field
              name="fromDateTime"
              label="From DateTime"
              placeholder="From Date Time"
              component={renderDateTime}
              validate={required}
            />

            <Field
              name="toDateTime"
              label="To DateTime"
              placeholder="To Date Time"
              component={renderDateTime}
              validate={required}
            />

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Feed Notification Image</label>
              </Col>
              <Col span={16}>
                <CloudinaryFileUpload
                  file={this.state.file}
                  onUpload={this.handleUploadWidget}
                  onDelete={() => this.setState({ file: null })}
                />
              </Col>
            </FormItem>

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Push Notification</label>
              </Col>
              <Col span={10}>
                <Field
                  name="pushNotificationMsg"
                  component={renderInput}
                  placeholder="Push Notification"
                />
              </Col>
              <Col span={6} className="custom-switch">
                <Field
                  name="pushNotificationActive"
                  label="Active"
                  component={renderSwitch}
                />
              </Col>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default reduxForm({ form: 'eventForm' })(EventForm);
