import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Alert } from 'antd';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { Link } from 'react-router-dom';
import { renderInput, renderSelect, renderSwitch, renderInputNumber } from '../../shared/utils/form_components';
import { required } from '../../shared/utils/form_validations';
import PlaceFields from './PlaceFields';
import DateFields from './DateFields';
import CloudinaryFileUpload from '../../shared/components/CloudinaryFileUpload';
import { NOTIFICATION_TYPES } from '../../shared/constants/constants';

const FormItem = Form.Item;

class ConditionForm extends Component {
  constructor(props) {
    super(props);

    this.state = { file: props.badgeReward || null };

    this.handleUploadWidget = this.handleUploadWidget.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleUploadWidget() {
    window.cloudinary.openUploadWidget(
      { cloud_name: 'onemap-co', upload_preset: 'bztfvbid', tags: ['xmas'] },
      (err, result) => result && this.setState({ file: result[0].secure_url })
    );
  }

  onSubmit(values) {
    return this.props.onSubmit({ ...values, badgeReward: this.state.file });
  }

  render() {
    const { handleSubmit, error, submitting, places, onDelete } = this.props;

    return (
      <Form layout="vertical" onSubmit={handleSubmit(this.onSubmit)}>
        <Row type="flex" justify="end">
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
        </Row>

        {error && <Row><FormItem><Alert message={error} type="error" closable /></FormItem></Row>}

        <Row gutter={32}>
          <Col span={12}>
            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Name</label>
              </Col>
              <Col span={10}>
                <Field
                  name="name"
                  component={renderInput}
                  placeholder="Condition Name"
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

            <Field
              name="pointReward"
              label="Point"
              component={renderInputNumber}
              placeholder="1000"
              normalize={val => parseInt(val)}
            />

            <FormItem>
              <Col span={8} className="ant-form-item-label">
                <label>Badge</label>
              </Col>
              <Col span={16}>
                <CloudinaryFileUpload
                  file={this.state.file}
                  onUpload={this.handleUploadWidget}
                  onDelete={() => this.setState({ file: null })}
                />
              </Col>
            </FormItem>

            <Field
              name="notificationType"
              label="Notification"
              component={renderSelect}
              placeholder="Select Notification"
              options={NOTIFICATION_TYPES}
            />

            <Field
              name="distance"
              label="Distance (m)"
              component={renderInputNumber}
              placeholder="3000"
              normalize={val => parseInt(val)}
            />
          </Col>

          <Col span={18}>
            <FieldArray
              places={places}
              name="places"
              component={PlaceFields}
            />
          </Col>

          <Col span={18}>
            <FieldArray
              name="dates"
              component={DateFields}
            />
          </Col>
        </Row>
      </Form>
    )
  }
}

export default reduxForm({ form: 'ConditionForm' })(ConditionForm);
