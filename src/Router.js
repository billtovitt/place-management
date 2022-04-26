import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import MainLayout from './shared/components/MainLayout';
import LoginScreen from './auth/Login';
import NotFoundScreen from './shared/components/NotFoundScreen';

class AppRouter extends Component {
  constructor(props) {
    super(props);

    this.onLoggedIn = this.onLoggedIn.bind(this);
  }

  onLoggedIn() {
    const { loggedInUserQuery: { loggedInUser } } = this.props;
    return loggedInUser && loggedInUser.id !== null;
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return <div className="loader-indicator" />;
    }

    const appRouter = (
      <Switch>
        <Route path="/" component={MainLayout} />
        <Route path="/" component={NotFoundScreen} />
      </Switch>
    );
    const authRouter = (
      <Switch>
        <Route path='/' component={LoginScreen} />
      </Switch>
    );

    return this.onLoggedIn() ? appRouter : authRouter;
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`
const AppRouterComponent = graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {
    fetchPolicy: 'network-only',
  }
})(AppRouter);

export default AppRouterComponent;
