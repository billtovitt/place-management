import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { STORY_STATUS } from './constants';

export const storiesColumns = [{
  title: 'Story Title',
  dataIndex: 'title',
  sorter: (a, b) => a.title.length - b.title.length,
  render: (value, record) => <Link to={`/stories/edit/${record.key}`}>{record.title}</Link>,
}, {
  title: 'Place Name',
  dataIndex: 'placeName',
  sorter: (a, b) => a.placeName.length - b.placeName.length,
  render: (value, record) =>
    <Link to={`/places/edit/${record.place.id}`}>{record.place.placeName}</Link>,
}, {
  title: 'Created By',
  dataIndex: 'createdBy',
  sorter: (a, b) => a.createdBy.length - b.createdBy.length,
  render: (value, record) => record && record.createdBy.username
}, {
  title: 'Display Name',
  dataIndex: 'displayName',
  sorter: (a, b) => a.displayName.length - b.displayName.length,
  render: (value, record) =>
    <Link to={`/users/admin/edit/${record.createdBy.id}`}>
      {record.createdBy.displayName}
    </Link>,
}, {
  title: 'Status',
  dataIndex: 'status',
  filters: STORY_STATUS.map(({ value, label }) => ({ text: label, value })),
  filterMultiple: false,
  onFilter: (value, record) => record.status.indexOf(value) === 0,
  sorter: (a, b) => a.status.length - b.status.length,
}, {
  title: 'Modified Date',
  dataIndex: 'updatedAt',
  render: (value) => value && moment(value).format('L'),
}];
