import React, { Component } from 'react';
import { Layout, Form, Icon, Input, Row, Col, Menu, Dropdown } from 'antd';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const FormItem = Form.Item;
const Header = Layout.Header;

class AppHeader extends Component {
  componentDidMount() {
    this.updateUserSubscription = this.props.fetchUser.subscribeToMore({
      document: gql`
        subscription {
          User(filter: {
            mutation_in: [UPDATED]
          }) {
            mutation
            node {
              id
              displayName
              email
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const user = subscriptionData.data.User.node;
        if (previousState.User.id == user.id) {
          return { User: user };
        }
        return previousState;
      },
      onError: (err) => console.error(err),
    });
  }

  onLogout() {
    localStorage.removeItem('graphcoolToken');
    window.location.reload();
  }

  render() {
    const { loggedInUserQuery, fetchUser } = this.props;
    if (loggedInUserQuery.loading || fetchUser.loading) return null;

    const inputSuffix = <Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />;

    const profileMenu = (
      <Menu>
        <Menu.Item><div onClick={() => this.onLogout()}>Logout</div></Menu.Item>
      </Menu>
    );

    return (
      <Header className="header">
        <Row>
          <Col className="search-box" span={6}>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <FormItem>
                <Input suffix={inputSuffix} placeholder="Search User" />
              </FormItem>
            </Form>
          </Col>
          <Col span={18}>
            <div className="profile-status is-right">
              <Menu mode="horizontal" selectable={false}>
                <Menu.Item><Icon type="question-circle-o" />Help</Menu.Item>
                <Menu.Item>
                  <Dropdown overlay={profileMenu}>
                    <div>
                      <span className="anticon circle online" />
                      {fetchUser.User ? fetchUser.User.displayName : fetchUser.User.email}
                      <Icon type="down" />
                    </div>
                  </Dropdown>
                </Menu.Item>
              </Menu>
            </div>
          </Col>
        </Row>
      </Header>
    );
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

const FETCH_USER = gql`
  query FetchUser($id: ID!) {
    User(id: $id) {
      id
      displayName
      email
    }
  }
`

const AppHeaderComponent = compose(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only',
    }
  }),
  graphql(FETCH_USER, {
    name: 'fetchUser',
    options: (props) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: props.loggedInUserQuery.loggedInUser.id,
      },
    })
  }),
)(AppHeader);

export default AppHeaderComponent;
