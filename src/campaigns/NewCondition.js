import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ConditionForm from './components/ConditionForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewCondition extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { createCondition, push, match: { params } } = this.props;
    return createCondition({ variables: { ...values, type: "CHECK_IN", campaignId: params.id } })
      .then(() => push(`/campaigns/edit/${params.id}`))
      .catch(parseFormErrors);
  }

  render() {
    const { match: { params }, fetchPlaces } = this.props;
    if (fetchPlaces.loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="new-condition">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/campaigns/edit/${params.id || 1}`}>Edit Campaign</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Condition</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New Condition</h3>

          <ConditionForm
            places={fetchPlaces.allPlaces}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

const FETCH_PLACES = gql`
  query FetchPlaces {
    allPlaces {
      id
      placeName
    }
  }
`

const CREATE_CONDITION = gql`
  mutation CreateCondition(
    $name: String!,
    $pointReward: Int!,
    $active: Boolean,
    $distance: Int!,
    $notificationType: NotificatiionType,
    $type: ConditionTypes!,
    $badgeReward: String!,
    $places: [ConditionplacesConditionPlace!]!,
    $dates: [ConditiondatesConditionDate!]!,
    $campaignId: ID,
  ) {
    createCondition(
      name: $name
      pointReward: $pointReward
      active: $active
      distance: $distance
      notificationType: $notificationType
      type: $type
      badgeReward: {
        name: "badge",
        photoURL: $badgeReward
      }
      places: $places
      dates: $dates
      campaignId: $campaignId
    ) {
      id
    }
  }
`

const NewConditionScreen = compose(
  graphql(FETCH_PLACES, {
    name: 'fetchPlaces',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(CREATE_CONDITION, {
    name: 'createCondition',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(NewCondition);

export default connect(null, { push })(NewConditionScreen);
