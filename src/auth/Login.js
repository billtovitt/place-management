import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Logo from '../shared/img/logo.png';

import LoginForm from './components/LoginForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return this.props.authenticateUserMutation({ variables: { ...values } })
      .then((res) => {
        localStorage.setItem('graphcoolToken', res.data.authenticateUser.token);
        window.location.href = "/";
      })
      .catch(parseFormErrors);
  }

  render() {
    return (
      <div id="login">
        <div className="login-wrapper">
          <img className="login-logo" alt="OneMap" src={Logo} />
          <LoginForm onSubmit={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation ($email: String!, $password: String!) { 
    authenticateUser(email: $email, password: $password) {
      token
    }
  }
`

const LoginScreen = graphql(AUTHENTICATE_USER_MUTATION, {
  name: 'authenticateUserMutation',
  options: {
    fetchPolicy: 'network-only',
  }
})(Login);

export default LoginScreen;
