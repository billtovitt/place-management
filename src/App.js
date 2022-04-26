import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { store, history } from './store';
import AppRouter from './Router';

const httpUri = 'https://api.graph.cool/simple/v1/cjb30vkvv434c0146sjjn4d4w';
const wsUri = 'wss://subscriptions.ap-northeast-1.graph.cool/v1/cjb30vkvv434c0146sjjn4d4w';

const httpLink = createHttpLink({ uri: httpUri });

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('graphcoolToken');
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const authToken = () => {
  const token = localStorage.getItem("graphcoolToken");
  return token ? `Bearer ${token}` : null;
};

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    connectionParams: () => {
      return { Authorization: authToken() }
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithAuthToken,
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <AppRouter />
          </ConnectedRouter>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
