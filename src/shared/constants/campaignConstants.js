import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

export const eventColumns = (campaignId) => [{
  title: 'From DateTime',
  dataIndex: 'dateTime',
  sorter: (a, b) => a.dateTime.length - b.dateTime.length,
  render: (value, record) => `${moment(record.fromDateTime).format('L')} - ${moment(record.toDateTime).format('L')}`
}, {
  title: 'Event Name',
  dataIndex: 'name',
  sorter: (a, b) => a.name.length - b.name.length,
  render: (value, record) => <Link to={`/campaigns/edit/${campaignId}/event/edit/${record.key}`}>{record.name}</Link>,
}, {
  title: 'City',
  dataIndex: 'city',
  sorter: (a, b) => a.city - b.city,
}, {
  title: 'Active',
  dataIndex: 'active',
  render: (value, record) => <span>{record.active ? 'Yes' : 'No'}</span>
}];

export const conditionColumns = (campaignId) => [{
  title: 'Condition Name',
  dataIndex: 'name',
  render: (text, record) =>
    <Link to={`/campaigns/edit/${campaignId}/condition/edit/${record.key}`}>{record.name}</Link>,
}, {
  title: 'Notification',
  dataIndex: 'notificationType',
  sorter: (a, b) => a.notificationType.length - b.notificationType.length,
}, {
  title: 'Point',
  dataIndex: 'pointReward',
}, {
  title: 'Active',
  dataIndex: 'active',
  render: (text, record) => <span>{record.active ? 'Yes' : 'No'}</span>
}];

export const campaignColumns = [{
  title: 'Campaign Name',
  dataIndex: 'name',
  sorter: (a, b) => a.name.length - b.name.length,
  render: (campaign, record) => <Link to={`/campaigns/edit/${record.key}`}>{record.name}</Link>,
}, {
  title: 'Created At',
  dataIndex: 'createdAt',
  sorter: (a, b) => a.createdAt.length - b.createdAt.length,
}, {
  title: 'Place',
  dataIndex: 'placeName',
  sorter: (a, b) => a.placeName.length - b.placeName.length,
  render: (place) => place ? place.defaultPlace.placeName : 'Not place',
}, {
  title: 'Active',
  dataIndex: 'active',
  render: (active) => active ? 'Yes' : 'No',
}, {
  title: 'Push Notification',
  dataIndex: 'pushNotificationActive',
  render: (pushNotifactive) => pushNotifactive ? 'Yes' : 'No',
}];
