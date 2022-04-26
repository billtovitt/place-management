import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import UserForm from './components/UserForm';
import { USER_GROUP, ENABLED, ONLINE_STATUS } from '../shared/constants/constants';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updateUser, signupUser, push } = this.props;
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);
    return signupUser({ variables: { ...values } })
      .then((res) => updateUser({ variables: { ...values, id: res.data.signupUser.id } }))
      .then(() => push(`/users/${userType.value.toLowerCase()}`))
      .catch(parseFormErrors);
  }

  render() {
    const { match: { params } } = this.props;
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);
    const initialValues = {
      registrationDate: moment().format('L'),
      onlineStatus: ONLINE_STATUS[0].value,
      accountStatus: ENABLED[0].value,
      username: "@",
    };

    return (
      <div id="new-place">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/users">Users</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/users/${userType.value.toLowerCase()}`}>{userType.label}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New User</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New User</h3>

          <UserForm
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!,
    $firstName: String!,
    $lastName: String!,
    $displayName: String
    $gender: Gender,
    $birthdate: String,
    $country: String,
    $city: String,
    $mobile: String,
    $photoURL: String,
    $bio: String,
    $registrationDate: String
    $lastSeen: DateTime
    $onlineStatus: OnlineStatus!
    $group: [UserGroup!]
    $accountStatus: Enabled!
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      displayName: $displayName
      gender: $gender
      birthdate: $birthdate
      country: $country
      city: $city
      mobile: $mobile
      photoURL: $photoURL
      bio: $bio
      registrationDate: $registrationDate
      lastSeen: $lastSeen
      onlineStatus: $onlineStatus
      group: $group
      accountStatus: $accountStatus
    ) {
      id
    }
  }
`

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!){
    signupUser(email: $email, password: $password) {
      id
    }
  }
`

const NewUserScreen = compose(
  graphql(UPDATE_USER, {
    name: 'updateUser',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(SIGN_UP, {
    name: 'signupUser',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(NewUser);

export default connect(null, { push })(NewUserScreen);
