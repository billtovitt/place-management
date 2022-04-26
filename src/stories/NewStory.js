import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import StoryForm from './components/StoryForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewStory extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { createStory, push } = this.props;
    return createStory({ variables: { ...values } })
      .then(() => push('/stories'))
      .catch(parseFormErrors);
  }

  render() {
    const { fetchPlaces, fetchUsers } = this.props;
    if (fetchPlaces.loading || fetchUsers.loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="new-story">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/stories">Stories</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Story</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New Story</h3>

          <StoryForm
            places={fetchPlaces.allPlaces}
            users={fetchUsers.allUsers}
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

const FETCH_USERS = gql`
  query FetchUsers {
    allUsers {
      id
      displayName
    }
  }
`

const CREATE_STORY = gql`
  mutation CreateStory(
    $title: String!,
    $story: String!,
    $pictureURL: [String!],
    $status: StoryStatus!
    $hashtag: [String!]
    $placeId: ID,
    $createdById: ID,
  ) {
    createStory(
      title: $title
      story: $story
      pictureURL: $pictureURL
      status: $status
      hashtag: $hashtag
      placeId: $placeId
      createdById: $createdById
    ) {
      id
    }
  }
`

const NewStoryScreen = compose(
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
  graphql(CREATE_STORY, {
    name: 'createStory',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(NewStory);

export default connect(null, { push })(NewStoryScreen);
