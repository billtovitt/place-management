import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { PlACE_STATUS, PLACE_SOURCE } from './constants';

export const placeColumns = [{
  title: 'Place Name',
  dataIndex: 'placeName',
  sorter: (a, b) => a.placeName.length - b.placeName.length,
  render: (value, record) => <Link to={`/places/edit/${record.key}`}>{record.placeName}</Link>,
}, {
  title: 'Status',
  dataIndex: 'status',
  filters: PlACE_STATUS.map(({ label, value }) => ({ text: label, value })),
  filterMultiple: false,
  onFilter: (value, record) => record.status.indexOf(value) === 0,
  sorter: (a, b) => a.status.length - b.status.length,
}, {
  title: 'Created Date',
  dataIndex: 'createdAt',
  sorter: (a, b) => a.createdAt.length - b.createdAt.length,
  render: (value) => value && moment(value).format('L'),
}, {
  title: 'Created By',
  dataIndex: 'createdBy',
  sorter: (a, b) => a.createdBy.length - b.createdBy.length,
  render: (value, record) => record && record.createdBy.username,
}, {
  title: 'City',
  dataIndex: 'addressCityTown',
}, {
  title: 'Country',
  dataIndex: 'addressCountry',
}, {
  title: 'Source',
  dataIndex: 'source',
  filters: PLACE_SOURCE.map(({ label, value }) => ({ text: label, value })),
  onFilter: (value, record) => record.source.indexOf(value) === 0,
}];
