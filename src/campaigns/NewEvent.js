import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import EventForm from './components/EventForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { createEventTable, push, match: { params } } = this.props;
    return createEventTable({ variables: { ...values, campaignId: params.id } })
      .then(() => push(`/campaigns/edit/${params.id}`))
      .catch(parseFormErrors);
  }

  render() {
    const { match: { params } } = this.props;
    return (
      <div id="new-event">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/campaigns">Campaigns</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/campaigns/edit/${params.id || 1}`}>Edit Campaign</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Event</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New Event</h3>

          <EventForm onSubmit={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

const CREATE_EVENT_TABLE = gql`
  mutation CreataEventTable(
    $name: String!,
    $fromDateTime: DateTime,
    $toDateTime: DateTime,
    $active: Enabled,
    $description: String,
    $campaignId: ID,
  ) {
    createEventTable(
      name: $name
      fromDateTime: $fromDateTime
      toDateTime: $toDateTime
      active: $active
      description: $description
      campaignId: $campaignId
    ) {
      id
    }
  }
`
const NewEventScreen = graphql(CREATE_EVENT_TABLE, {
  name: 'createEventTable',
  options: {
    fetchPolicy: 'network-only',
  },
})(NewEvent);

export default connect(null, { push })(NewEventScreen);
