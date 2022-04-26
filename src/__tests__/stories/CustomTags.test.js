import React from 'react';
import { shallow } from "enzyme";
import CustomTags from '../../stories/components/CustomTags';

describe('testing custom tags', () => {
  it('renders CustomTags is creating', () => {
    const changeTags = jest.fn();
    const updateTags = jest.fn();
    const customTagsTest = shallow(
      <CustomTags
        tags={['tags']}
        isCreating={true}
        onChange={changeTags}
        onUpdate={updateTags}
        onDelete={jest.fn()}
        onClick={jest.fn()}
      />
    );
    
    customTagsTest.find('Input').simulate('change', 'Test');
    expect(changeTags).toBeCalledWith('Test');
    expect(customTagsTest.find('Tag').length).toBe(1);
    customTagsTest.find('Input').simulate('blur');
    expect(updateTags).toBeCalledWith();
  });

  it('renders CustomTags is not creating', () => {
    const changeTags = jest.fn();
    const updateTags = jest.fn();
    const customTagsTest = shallow(
      <CustomTags
        tags={['tags']}
        isCreating={false}
        onChange={changeTags}
        onUpdate={updateTags}
        onDelete={jest.fn()}
        onClick={jest.fn()}
      />
    );
    console.log(customTagsTest.debug());
    expect(customTagsTest.find('Input').length).toBe(0);
    expect(customTagsTest.find('Tag').length).toBe(2);
  });
});
