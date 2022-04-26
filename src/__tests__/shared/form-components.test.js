import React from 'react';
import { Icon } from 'antd';
import {
  renderLabel,
  renderDateTime,
  renderInput,
  renderInputUpload,
  renderPlacesAutocomplete,
  renderSelect,
  renderTextarea,
} from '../../shared/utils/form_components';
import { shallow } from "enzyme";

describe('form components', () => {
  const onChange = jest.fn();
  const meta = { form: 'form', touched: true, error: '' };

  it('renders renderLabel', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '' };
    const renderLabelTest = shallow(renderLabel(props));
    expect(renderLabelTest.find('span').hasClass('ant-form-text')).toBe(true);
  });

  it('renders renderDateTime', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '', placeholder: 'Birthday' };
    const renderDateTimeTest = shallow(renderDateTime(props));
    expect(renderDateTimeTest.find('PickerWrapper').length).toBe(1);
    expect(renderDateTimeTest.find('PickerWrapper').prop('placeholder')).toEqual('Birthday');
  });

  it('renders renderInput', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '' };
    const renderInputTest = shallow(renderInput(props));
    expect(renderInputTest.find('Input').length).toBe(1);
  });

  it('renders renderPlacesAutocomplete', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '', value: '' };
    const renderPlacesAutocompleteTest = shallow(renderPlacesAutocomplete(props));
    expect(renderPlacesAutocompleteTest.find('PlacesAutocomplete').length).toBe(1);
  });

  it('renders renderInputUpload', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '' };
    const renderInputUploadTest = shallow(renderInputUpload(props));
    expect(renderInputUploadTest.find('Upload').length).toBe(1);
    expect(renderInputUploadTest.find('Upload').contains(<Icon type="plus" />)).toBe(true);
  });

  it('renders renderTextarea', () => {
    const props = { input: { name, onChange, id: 'id' }, meta, label: '' };
    const renderTextareaTest = shallow(renderTextarea(props));
    expect(renderTextareaTest.find('textarea').length).toBe(1);
    expect(renderTextareaTest.find('textarea').hasClass('is-fullwidth')).toBe(true);
  });

  it('renders renderSelect', () => {
    const options = [
      { value: 'Thailand', label: 'Thailand' },
      { value: 'Qazakhstan', label: 'Qazakhstan' },
      { value: 'Japan', label: 'Japan' },
    ];
    const props = { input: { name, onChange, id: 'id' }, meta, label: '', options };
    const renderSelectTest = shallow(renderSelect(props));
    expect(renderSelectTest.find('Select').length).toBe(1);
  });
});
