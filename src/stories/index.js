import React, { Component } from 'react';
import { Breadcrumb, Table, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { storiesColumns } from '../shared/constants/storiesConstants';

class Stories extends Component {

  componentDidMount() {
    this.updateStorySubscription = this.props.fetchStories.subscribeToMore({
      document: gql`
        subscription {
          Story(filter: {
            mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            mutation
            node {
              id
              updatedAt
              title
              status
              createdBy {
                id
                username
                displayName
              }
              place {
                id
                placeName
              }
            }
            previousValues {
              id
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const { node, mutation, previousValues } = subscriptionData.data.Story;
        switch (mutation) {
          case 'CREATED': {
            return { allStories: previousState.allStories.concat(node) };
          }
          case 'UPDATED': {
            return {
              allStories: previousState.allStories
                .map(story => story.id == node.id ? node : story)
            };
          }
          case 'DELETED': {
            return { allStories: previousState.allStories.filter(story => story.id != previousValues.id) };
          };
          default:
            return previousState;
        }
      },
      onError: (err) => console.error(err),
    });
  }

  render() {
    const { fetchStories: { loading, allStories } } = this.props;
    if (loading) {
      return <div className="loader-indicator" />;
    }

    const dataSource = allStories.map(story => ({ ...story, key: story.id }));

    return (
      <div id="places">
        <Breadcrumb>
          <Breadcrumb.Item>Stories</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h4>
            Manage Stories
            <div className="is-right">
              <Button.Group size="small">
                <Button>
                  <Link to="/stories/new"><Icon type="plus" />New Story</Link>
                </Button>
                <Button>
                  Report<Icon type="down" />
                </Button>
              </Button.Group>
            </div>
          </h4>

          <Table
            columns={storiesColumns}
            dataSource={dataSource}
            expandedRowRender={record => <p className="no-margin">{record.description}</p>}
          />
        </div>
      </div>
    )
  }
}

const FETCH_STORIES = gql`
  query FetchStories {
    allStories {
      id
      updatedAt
      title
      status
      createdBy {
        id
        username
        displayName
      }
      place {
        id
        placeName
      }
    }
  }
`

const StoriesScreen = graphql(FETCH_STORIES, {
  name: 'fetchStories',
  options: {
    fetchPolicy: 'network-only',
  },
})(Stories)

export default StoriesScreen;
