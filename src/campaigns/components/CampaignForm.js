import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Alert } from 'antd';
import { Field, reduxForm, reset } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  renderInput,
  renderSelect,
  renderTextarea,
  renderSwitch,
} from '../../shared/utils/form_components';
import { required } from '../../shared/utils/form_validations';
import CustomTags from '../../stories/components/CustomTags';
import CloudinaryFileUpload from '../../shared/components/CloudinaryFileUpload';

const FormItem = Form.Item;

class CampaignForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availableCities: [],
      newAvailableCity: null,
      feedNotificationImg: props.feedNotificationImg || null,
      photoUrl: props.photoUrl || null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
    this.handleUploadWidget = this.handleUploadWidget.bind(this);
  }

  handleUploadWidget(fieldName) {
    window.cloudinary.openUploadWidget(
      { cloud_name: 'onemap-co', upload_preset: 'bztfvbid', tags: ['xmas'] },
      (err, result) => {
        if (err) {
          console.error(err.message);
        } else if (result) {
          this.setState({ [fieldName]: result[0].secure_url });
        }
      }
    );
  }

  onSubmit(values) {
    const { availableCities, feedNotificationImg, photoUrl } = this.state;
    return this.props.onSubmit({
      ...values, availableCities, feedNotificationImg, photoUrl
    });
  }

  handleDeleteTag = (removedTag) => {
    const availableCities = this.state.availableCities.filter(availableCity => availableCity != removedTag);
    this.setState({ availableCities });
  }

  handleUpdateTags = () => {
    const { newAvailableCity, availableCities } = this.state;
    const newAvailableCities = _.uniq(availableCities.concat(newAvailableCity))
    this.setState({ availableCities: newAvailableCities, newAvailableCity: null });
  }

  render() {
    const { handleSubmit, error, submitting, places, users, onDelete } = this.props;
    const { availableCities, newAvailableCity } = this.state;
    const placeOptions = places.map(({ id, placeName }) => ({ value: id, label: placeName }));
    const usersOptions = users.map(({ id, displayName }) => ({ value: id, label: displayName }));

    return (
      <Form layout="vertical" onSubmit={handleSubmit(this.onSubmit)}>
        <Row>
          <div className="is-right">
            <FormItem>
              <Button style={{ marginRight: 5 }}>
                <Link to="/campaigns">Cancel</Link>
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
          <Col span={12}>
            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Campaign Name</label>
              </Col>
              <Col span={10}>
                <Field
                  name="name"
                  component={renderInput}
                  placeholder="Campaign Name"
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
                <CustomTags
                  tags={availableCities}
                  isCreating={newAvailableCity != null}
                  onChange={(e) => this.setState({ newAvailableCity: e.target.value })}
                  onUpdate={this.handleUpdateTags}
                  onDelete={this.handleDeleteTag}
                  onClick={() => this.setState({ newAvailableCity: '' })}
                />
              </Col>
            </FormItem>

            <Field
              name="description"
              label="Campaign Description"
              component={renderTextarea}
              placeholder="Campaign Description"
            />

            <Field
              name="partnerId"
              label="Partner Account"
              component={renderSelect}
              placeholder="Select Partner"
              options={usersOptions}
            />

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Push Notification</label>
              </Col>
              <Col span={10}>
                <Field
                  name="pushNotificationMsg"
                  component={renderInput}
                  placeholder="Message"
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

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Feed Notification</label>
              </Col>
              <Col span={10}>
                <Field
                  name="feedNotificationMsg"
                  component={renderInput}
                  placeholder="Message"
                />
              </Col>
              <Col span={6} className="custom-switch">
                <Field
                  name="feedNotificationActive"
                  label="Active"
                  component={renderSwitch}
                />
              </Col>
            </FormItem>

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Feed Notification Image</label>
              </Col>
              <Col span={16}>
                <CloudinaryFileUpload
                  file={this.state.feedNotificationImg}
                  onUpload={() => this.handleUploadWidget('feedNotificationImg')}
                  onDelete={() => this.setState({ feedNotificationImg: null })}
                />
              </Col>
            </FormItem>

            <Field
              name="defaultPlaceId"
              label="Place Name"
              component={renderSelect}
              placeholder="Place Name"
              options={placeOptions}
            />

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Photo</label>
              </Col>
              <Col span={16}>
                <CloudinaryFileUpload
                  file={this.state.photoUrl}
                  onUpload={() => this.handleUploadWidget('photoUrl')}
                  onDelete={() => this.setState({ photoUrl: null })}
                />
              </Col>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default reduxForm({ form: 'campaignForm' })(CampaignForm);
