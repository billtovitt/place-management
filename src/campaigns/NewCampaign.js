import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import CampaignForm from './components/CampaignForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewCampaign extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { createCampaign, push } = this.props;
    return createCampaign({ variables: { ...values } })
      .then(() => push('/campaigns'))
      .catch(parseFormErrors);
  }

  render() {
    const { fetchPlaces, fetchUsers } = this.props;
    if (fetchPlaces.loading || fetchUsers.loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="new-campaign">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Campaign</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New Campaign</h3>

          <CampaignForm
            places={fetchPlaces.allPlaces}
            users={fetchUsers.allUsers}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

const FETCH_USERS = gql`
  query FetchUsers {
    allUsers {
      id
      displayName
    }
  }
`

const FETCH_PLACES = gql`
  query FetchPlaces {
    allPlaces {
      id
      placeName
    }
  }
`

const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign(
    $name: String!,
    $availableCities: [String!],
    $description: String,
    $defaultPlaceId: ID,
    $active: Boolean,
    $partnerId: ID,
    $pushNotificationActive: Boolean,
    $pushNotificationMsg: String,
    $feedNotificationActive: Boolean,
    $feedNotificationImg: String,
    $feedNotificationMsg: String,
    $photoUrl: String!,
  ) {
    createCampaign(
      name: $name
      availableCities: $availableCities
      description: $description
      defaultPlaceId: $defaultPlaceId
      active: $active
      partnerId: $partnerId
      pushNotificationActive: $pushNotificationActive
      pushNotificationMsg: $pushNotificationMsg
      feedNotificationActive: $feedNotificationActive
      feedNotificationImg: $feedNotificationImg
      feedNotificationMsg: $feedNotificationMsg
      photoUrl: $photoUrl
    ) {
      id
    }
  }
`

const NewCampaignScreen = compose(
  graphql(FETCH_PLACES, {
    name: 'fetchPlaces',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(FETCH_USERS, {
    name: 'fetchUsers',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(CREATE_CAMPAIGN, {
    name: 'createCampaign',
    options: {
      fetchPolicy: 'network-only',
    }
  }),
)(NewCampaign);

export default connect(null, { push })(NewCampaignScreen);
