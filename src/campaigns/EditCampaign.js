import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Divider, Table, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import CampaignForm from './components/CampaignForm';
import { parseFormErrors } from '../shared/utils/form_errors';

import { conditionColumns, eventColumns } from '../shared/constants/campaignConstants';

class EditCampaign extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updateCampaign, push } = this.props;
    return updateCampaign({ variables: { ...values, id: params.id } })
      .then(() => push('/campaigns'))
      .catch(parseFormErrors);
  }

  handleDelete() {
    const { match: { params }, deleteCampaign, push } = this.props;
    deleteCampaign({ variables: { id: params.id } })
      .then(() => push('/campaigns'));
  }

  render() {
    const { fetchCampaign, fetchPlaces, fetchUsers, fetchEventTables, fetchConditions, match: { params } } = this.props;

    if (fetchPlaces.loading || fetchCampaign.loading || fetchUsers.loading
      || fetchEventTables.loading || fetchConditions.loading) {
      return <div className="loader-indicator" />;
    }

    const initialValues = {
      ...fetchCampaign.Campaign,
      partnerId: fetchCampaign.Campaign.partner.id,
      placeId: fetchCampaign.Campaign.defaultPlace.id,
    };

    const dataSourceEvent = fetchEventTables.allEventTables.map(eventTable =>
      ({ key: eventTable.id, ...eventTable }));
    const dataSourceCondition = fetchConditions.allConditions.map(condition =>
      ({ key: condition.id, ...condition }));

    return (
      <div id="edit-campaign">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Edit Campaign</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>Edit Campaign</h3>

          <CampaignForm
            initialValues={initialValues}
            places={fetchPlaces.allPlaces}
            users={fetchUsers.allUsers}
            feedNotificationImg={fetchCampaign.Campaign.feedNotificationImg}
            photoUrl={fetchCampaign.Campaign.photoUrl}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
          />

          <Divider />

          <h4>
            Events Calendar
            <div className="is-right">
              <Button.Group size="small">
                <Button>
                  <Link to={`/campaigns/edit/${params.id}/event/new`}>
                    <Icon type="plus" />New Event
                  </Link>
                </Button>
                <Button>
                  Report<Icon type="down" />
                </Button>
              </Button.Group>
            </div>
          </h4>

          <Table
            columns={eventColumns(params.id)}
            dataSource={dataSourceEvent}
          />

          <Divider />

          <h4>
            Condition
            <div className="is-right">
              <Button.Group size="small">
                <Button>
                  <Link to={`/campaigns/edit/${params.id}/condition/new`}>
                    <Icon type="plus" />New Condition
                  </Link>
                </Button>
                <Button>
                  Report<Icon type="down" />
                </Button>
              </Button.Group>
            </div>
          </h4>

          <Table
            columns={conditionColumns(params.id)}
            dataSource={dataSourceCondition}
          />
        </div>
      </div>
    );
  }
}

const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      id
    }
  }
`

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
const FETCH_CAMPAIGN = gql`
  query FetchCampaign($id: ID!) {
    Campaign(id: $id) {
      id
      createdAt
      name
      description
      active
      photoUrl
      partner {
        id
        displayName
      }
      defaultPlace {
        id
        placeName
      }
      pushNotificationActive
      pushNotificationMsg
      feedNotificationActive
      feedNotificationImg
      feedNotificationMsg
    }
  }
`

const FETCH_EVENT_TABLES = gql`
  query FetchEventTables($campaignId: ID) {
    allEventTables(filter: {
      campaign: {
        id: $campaignId
      }
    }) {
      id
      name
      fromDateTime
      toDateTime
      active
    }
  }
`

const FETCH_CONDITIONS = gql`
  query FetchConditions($campaignId: ID) {
    allConditions(filter: {
      campaign: {
        id: $campaignId
      }
    }) {
      id
      name
      notificationType
      pointReward
      active
    }
  }
`

const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign(
    $id: ID!,
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
    updateCampaign (
      id: $id
      name: $name
      availableCities: $availableCities
      description: $description
      defaultPlaceId: $defaultPlaceId
      active: $active
      partnerId: $partnerId
      pushNotificationActive: $pushNotificationActive
      pushNotificationMsg: $pushNotificationMsg,
      feedNotificationActive: $feedNotificationActive,
      feedNotificationImg: $feedNotificationImg,
      feedNotificationMsg: $feedNotificationMsg,
      photoUrl: $photoUrl,
    ) {
      id
    }
  }
`

const EditCampaignScreen = compose(
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
  graphql(FETCH_CAMPAIGN, {
    name: 'fetchCampaign',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(FETCH_EVENT_TABLES, {
    name: 'fetchEventTables',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(FETCH_CONDITIONS, {
    name: 'fetchConditions',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_CAMPAIGN, {
    name: 'updateCampaign',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_CAMPAIGN, {
    name: 'deleteCampaign',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(EditCampaign);

export default connect(null, { push })(EditCampaignScreen);
