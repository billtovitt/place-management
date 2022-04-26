import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import EventForm from './components/EventForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updateEventTable, push } = this.props;
    return updateEventTable({ variables: { ...values, id: params.eventId } })
      .then(() => push(`/campaigns/edit/${params.id}`))
      .catch(parseFormErrors);
  }

  handleDelete() {
    const { match: { params }, deleteEventTable, push } = this.props;
    deleteEventTable({ variables: { id: params.eventId } })
      .then(() => push(`/campaigns/edit/${params.id}`));
  }

  render() {
    const { match: { params }, fetchEventTable } = this.props;
    if (fetchEventTable.loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="edit-event">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/campaigns/edit/${params.id}`}>Edit Campaign</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit Event</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>Edit Event</h3>

          <EventForm
            initialValues={fetchEventTable.EventTable}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}

const FETCH_EVENT_TABLE = gql`
  query FetchEventTable($id: ID!) {
    EventTable(id: $id) {
      id
      name
      fromDateTime
      toDateTime
      active
      description
    }
  }
`

const UPDATE_EVENT_TABLE = gql`
  mutation UpdateEventTable(
    $id: ID!,
    $name: String!,
    $fromDateTime: DateTime,
    $toDateTime: DateTime,
    $active: Enabled,
    $description: String,
  ) {
    updateEventTable (
      id: $id
      name: $name
      fromDateTime: $fromDateTime
      toDateTime: $toDateTime
      active: $active
      description: $description
    ) {
      id
    }
  }
`

const DELETE_EVENT_TABLE = gql`
  mutation DeleteEventTable($id: ID!) {
    deleteEventTable(id: $id) {
      id
    }
  }
`

const EditEventScreen = compose(
  graphql(FETCH_EVENT_TABLE, {
    name: 'fetchEventTable',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.eventId,
      },
    }),
  }),
  graphql(UPDATE_EVENT_TABLE, {
    name: 'updateEventTable',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_EVENT_TABLE, {
    name: 'deleteEventTable',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(EditEvent);

export default connect(null, { push })(EditEventScreen);
