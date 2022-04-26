import React from 'react';
import { Field } from 'redux-form';
import { Form, Button, Icon, Row, Col, Input } from 'antd';
import { renderDateTime } from '../../shared/utils/form_components';
import { required } from '../../shared/utils/form_validations';

const FormItem = Form.Item;

const PlaceFields = ({ fields, label }) => {
  if (fields.length == 0) fields.push({});
  const lastIdx = fields.length - 1;

  return (
    <div className="form-fields">
      {fields.map((date, index, fields) => {
        return (
          <Row key={date} gutter={8}>
            <Col span={10}>
              <Field
                name={`${date}.fromDateTime`}
                label="From DateTime"
                component={renderDateTime}
                placeholder="from"
                validate={index == lastIdx ? null : required}
              />
            </Col>

            <Col span={10}>
              <Field
                name={`${date}.toDateTime`}
                label="To DateTime"
                component={renderDateTime}
                placeholder="To"
                validate={index == lastIdx ? null : required}
              />
            </Col>

            {index != lastIdx && (
              <Col span={2}>
                <Button onClick={() => fields.remove(index)}>
                  <Icon type="delete" />
                </Button>
              </Col>
            )}
          </Row>);
      })}

      <FormItem>
        <div className="is-right">
          <Button style={{ marginRight: 5 }} onClick={() => fields.push({})}>
            <Icon type="plus" />
          </Button>
          {fields.length > 0 &&
            <Button onClick={() => fields.removeAll()}>Clear all</Button>
          }
        </div>
      </FormItem>
    </div>
  );
}

export default PlaceFields;
