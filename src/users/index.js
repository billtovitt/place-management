import React, { Component } from 'react';
import { Breadcrumb, Table, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { usersColumns } from '../shared/constants/usersConstants';
import { USER_GROUP } from '../shared/constants/constants';

class Users extends Component {
  componentDidMount() {
    this.updateUserSubscription = this.props.fetchUsers.subscribeToMore({
      document: gql`
        subscription {
          User(filter: {
            mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            mutation
            node {
              id
              displayName
              city
              country
              username
              lastSeen
              onlineStatus
              group
              photoURL
            }
            previousValues {
              id
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const { node, mutation, previousValues } = subscriptionData.data.User;
        switch (mutation) {
          case 'CREATED': {
            return { allUsers: previousState.allUsers.concat(node) };
          }
          case 'UPDATED': {
            return {
              allUsers: previousState.allUsers
                .map(user => user.id == node.id ? node : user)
            };
          }
          case 'DELETED': {
            return { allUsers: previousState.allUsers.filter(user => user.id != previousValues.id) };
          };
          default:
            return previousState;
        }
      },
      onError: (err) => console.error(err),
    });
  }

  render() {
    const { fetchUsers: { loading, allUsers }, match: { params } } = this.props;
    if (loading) {
      return <div className="loader-indicator" />;
    }

    const dataSource = allUsers
      .filter(user => (user.group || []).includes((params.type || '').toUpperCase()))
      .map(user => ({ ...user, key: user.id }));
    const userType = USER_GROUP.find(group => group.value.toLowerCase() == params.type);

    return (
      <div id="users">
        <Breadcrumb>
          <Breadcrumb.Item>Users</Breadcrumb.Item>
          <Breadcrumb.Item>
            {userType && userType.label}
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h4>
            Manage Users
            <div className="is-right">
              <Button.Group size="small">
                <Button>
                  <Link to={`/users/${userType.value.toLowerCase()}/new`}>
                    <Icon type="plus" />New User
                  </Link>
                </Button>
                <Button>
                  Report<Icon type="down" />
                </Button>
              </Button.Group>
            </div>
          </h4>

          <Table
            columns={usersColumns(userType.value.toLowerCase())}
            dataSource={dataSource}
            expandedRowRender={record => <p className="no-margin">{record.description}</p>}
          />
        </div>
      </div>
    )
  }
}

const FETCH_USERS = gql`
  query FetchUsers {
    allUsers {
      id
      displayName
      city
      country
      username
      lastSeen
      onlineStatus
      group
      photoURL
    }
  }
`

const UsersScreen = graphql(FETCH_USERS, {
  name: 'fetchUsers',
  options: {
    fetchPolicy: 'network-only',
  },
})(Users);

export default UsersScreen;
