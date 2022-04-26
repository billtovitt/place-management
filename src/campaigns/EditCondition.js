import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ConditionForm from './components/ConditionForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class EditCondition extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updateCondition, push } = this.props;
    return updateCondition({ variables: { ...values, id: params.conditionId } })
      .then(() => push(`/campaigns/edit/${params.id}`))
      .catch(parseFormErrors);
  }

  handleDelete() {
    const { match: { params }, deleteCondition, push } = this.props;
    deleteCondition({ variables: { id: params.conditionId } })
      .then(() => push(`/campaigns/edit/${params.id}`));
  }

  render() {
    const { match: { params }, fetchCondition, fetchPlaces } = this.props;

    if (fetchCondition.loading || fetchPlaces.loading) {
      return <div className="loader-indicator" />;
    }

    const initialValues = {
      ...fetchCondition.Condition,
      places: fetchCondition.Condition.places.map(place => ({ placeId: place.place.id, event: place.event, distance: place.distance })),
      dates: fetchCondition.Condition.dates.map(({ fromDateTime, toDateTime }) => ({ fromDateTime, toDateTime })),
    };

    return (
      <div id="edit-condition">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/campaigns/edit/${params.id || 1}`}>Edit Campaign</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit Condition</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>Edit Condition</h3>

          <ConditionForm
            initialValues={initialValues}
            places={fetchPlaces.allPlaces}
            badgeReward={fetchCondition.Condition.badgeReward.photoURL}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
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

const FETCH_CONDITION = gql`
  query FetchCondition($id: ID!) {
    Condition(id: $id) {
      id
      name
      notificationType
      pointReward
      active
      distance
      badgeReward {
        id
        name
        photoURL
      }
      places {
        id
        place {
          id
          placeName
        }
        event
        distance
      }
      dates {
        fromDateTime
        toDateTime
      }
    }
  }
`

const UPDATE_CONDITION = gql`
  mutation UpdateCondition(
    $id: ID!,
    $name: String!,
    $pointReward: Int!,
    $active: Boolean,
    $distance: Int!,
    $notificationType: NotificatiionType,
    $badgeReward: String!,
    $dates: [ConditiondatesConditionDate!]!,
    $places: [ConditionplacesConditionPlace!]!,
  ) {
    updateCondition (
      id: $id
      name: $name
      pointReward: $pointReward
      active: $active
      distance: $distance
      notificationType: $notificationType
      badgeReward: {
        name: "badge",
        photoURL: $badgeReward
      }
      dates: $dates
      places: $places
    ) {
      id
    }
  }
`

const DELETE_CONDITION = gql`
  mutation DeleteCondition($id: ID!) {
    deleteCondition(id: $id) {
      id
    }
  }
`

const EditConditionScreen = compose(
  graphql(FETCH_PLACES, {
    name: 'fetchPlaces',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(FETCH_CONDITION, {
    name: 'fetchCondition',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.conditionId,
      },
    }),
  }),
  graphql(UPDATE_CONDITION, {
    name: 'updateCondition',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_CONDITION, {
    name: 'deleteCondition',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(EditCondition);

export default connect(null, { push })(EditConditionScreen);
