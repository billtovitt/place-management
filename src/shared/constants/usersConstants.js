import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { USER_GROUP, ONLINE_STATUS } from './constants';

export const usersColumns = (userType) => [{
  title: 'Display Name',
  dataIndex: 'displayName',
  sorter: (a, b) => a.displayName.length - b.displayName.length,
  render: (value, record) =>
    <Link to={`/users/${userType}/edit/${record.id}`}>
      {record.displayName || record.email}
    </Link>,
}, {
  title: 'Status',
  dataIndex: 'onlineStatus',
  filters: ONLINE_STATUS.map(({ label, value }) => ({ text: label, value })),
  filterMultiple: false,
  onFilter: (value, record) => record.onlineStatus.indexOf(value) === 0,
  sorter: (a, b) => a.onlineStatus.length - b.onlineStatus.length,
}, {
  title: 'Last Login',
  dataIndex: 'lastSeen',
  render: (value) => value ? moment(value).format('L') : 'No logined',
}, {
  title: 'User Name',
  dataIndex: 'username',
  render: (value) => value ? value : 'No User Name',
}, {
  title: 'City',
  dataIndex: 'city',
}, {
  title: 'Country',
  dataIndex: 'country',
}, , {
  title: 'Role',
  dataIndex: 'group',
  sorter: (a, b) => a.group - b.group,
  filters: USER_GROUP.map(({ label, value }) => ({ text: label, value })),
  onFilter: (value, record) => record.group.indexOf(value) === 0,
  render: (value) => {
    const user = USER_GROUP.find(group => group.value == value);
    return user ? user.label : 'No User Group';
  },
}];
