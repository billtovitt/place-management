import React from 'react';
import { Form, Input, Select, DatePicker, Upload, Icon, Switch, InputNumber } from 'antd';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const getValidationState = ({ error, warning, touched }) => {
  if (touched && error) return "error";
  if (touched && warning) return "warning";
  return 'success';
};

const render = ({ input, label, meta, ...props }, renderInput) => {
  const id = `${meta.form}_${input.name}`;
  const inputProps = { ...input, id, ...props };
  const validateStatus = getValidationState(meta);

  return (
    <FormItem
      {...formItemLayout}
      label={label || ''}
      validateStatus={validateStatus}
      help={meta.touched && meta.error || ''}
    >
      {renderInput(inputProps)}
    </FormItem>
  );
};

export const renderInput = (props) => render(props, (inputProps) => {
  return (
    <Input {...inputProps} />
  );
});

export const renderInputNumber = (props) => render(props, (inputProps) => {
  return (
    <InputNumber min={0} max={1000000} {...inputProps} />
  );
});

export const renderSelect = ({ options, ...props }) => render(props, ({ value, ...inputProps }) => {
  return (
    <Select {...inputProps} value={value || undefined}>
      {options.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)}
    </Select>
  );
});

export const renderDateTime = (props) => render(props, (inputProps) => {
  const { name, id, placeholder, value } = inputProps;
  const onChange = (date, dateString) => inputProps.onChange(dateString);
  const props = _.omit({ name, id, placeholder, value: value ? moment(value) : null }, value ? [] : 'value');

  return (
    <DatePicker {...props} onChange={onChange} />
  );
});

export const renderLabel = (props) => render(props, ({ value }) => {
  return (
    <span className="ant-form-text">{value}</span>
  );
});

export const renderTextarea = (props) => render(props, (inputProps) => {
  return (
    <textarea className="ant-input is-fullwidth" {...inputProps} />
  );
});

export const renderInputUpload = (props) => render(props, (inputProps) => {
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Upload {...inputProps}>{uploadButton}</Upload>
  );
});

export const renderPlacesAutocomplete = (props) => render(props, (inputProps) => {
  return (
    <PlacesAutocomplete
      inputProps={inputProps}
      classNames={{
        input: "ant-input",
      }}
      styles={{
        autocompleteContainer: {
          zIndex: 2,
        }
      }}
    />
  );
});

export const renderRangePicker = (props) => render(props, (inputProps) => {
  const { name, id } = inputProps;
  const onChange = (date, dateString) => inputProps.onChange(dateString);
  return (
    <DatePicker.RangePicker
      name={name}
      id={id}
      onChange={onChange}
    />
  );
});

export const renderSwitch = (props) => render(props, (inputProps) => {
  const checked = inputProps.value == '' ? false : inputProps.value;
  return <Switch checked={checked} {...inputProps} />
});
