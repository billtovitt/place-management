import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import UserForm from './components/UserForm';
import { USER_GROUP } from '../shared/constants/constants';
import { parseFormErrors } from '../shared/utils/form_errors';

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updateUser, push } = this.props;
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);
    return updateUser({ variables: { ...values, id: params.id } })
      .then(() => push(`/users/${userType.value.toLowerCase()}`))
      .catch(parseFormErrors);
  }

  handleDelete() {
    const { match: { params }, deleteUser, push } = this.props;
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);
    deleteUser({ variables: { id: params.id } })
      .then(() => push(`/users/${userType.value.toLowerCase()}`));
  }

  render() {
    const { match: { params }, fetchUser: { loading, User } } = this.props;
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);

    if (loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="edit-place">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/users">Users</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/users/${userType.value.toLowerCase()}`}>{userType.label}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit User</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>Edit User</h3>

          <UserForm
            initialValues={User}
            photoURL={User.photoURL}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}

const FETCH_USER = gql`
  query FetchUser($id: ID!) {
    User(id: $id) {
      createdBy {
        id
        username
      }
      firstName
      lastName
      email
      password
      displayName
      gender
      birthdate
      city
      country
      mobile
      username
      photoURL
      registrationDate
      lastSeen
      onlineStatus
      group
    }
  }
`
const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!,
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!,
    $displayName: String
    $gender: Gender,
    $birthdate: String,
    $country: String,
    $city: String,
    $mobile: String,
    $username: String,
    $photoURL: String,
    $bio: String,
    $group: [UserGroup!]
  ) {
    updateUser (
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      displayName: $displayName
      gender: $gender
      birthdate: $birthdate
      country: $country
      city: $city
      mobile: $mobile
      username: $username
      photoURL: $photoURL
      bio: $bio
      group: $group
    ) {
      id
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const EditUserScreen = compose(
  graphql(FETCH_USER, {
    name: 'fetchUser',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_USER, {
    name: 'updateUser',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_USER, {
    name: 'deleteUser',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(EditUser);

export default connect(null, { push })(EditUserScreen);
