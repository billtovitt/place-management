import React, { Component } from 'react';
import { Breadcrumb, Table, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { placeColumns } from '../shared/constants/placesConstants';

class Places extends Component {
  componentDidMount() {
    this.updateUserSubscription = this.props.fetchPlaces.subscribeToMore({
      document: gql`
        subscription {
          Place(filter: {
            mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            mutation
            node {
              id
              createdAt
              placeName
              description
              addressCityTown
              addressCountry
              source
              status
              createdBy {
                id
                username
              }
            }
            previousValues {
              id
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const { node, mutation, previousValues } = subscriptionData.data.Place;
        switch (mutation) {
          case 'CREATED': {
            return { allPlaces: previousState.allPlaces.concat(node) };
          }
          case 'UPDATED': {
            return {
              allPlaces: previousState.allPlaces
                .map(place => place.id == node.id ? node : place)
            };
          }
          case 'DELETED': {
            return { allPlaces: previousState.allPlaces.filter(place => place.id != previousValues.id) };
          };
          default:
            return previousState;
        }
      },
      onError: (err) => console.error(err),
    });
  }

  render() {
    const { fetchPlaces: { loading, allPlaces } } = this.props;
    if (loading) {
      return <div className="loader-indicator" />;
    }

    const dataSource = allPlaces.map(place => ({ ...place, key: place.id }));

    return (
      <div id="places">
        <Breadcrumb>
          <Breadcrumb.Item>Places</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h4>
            Manage Places
            <div className="is-right">
              <Button.Group size="small">
                <Button>
                  <Link to="/places/new"><Icon type="plus" />New Place</Link>
                </Button>
                <Button>
                  Report<Icon type="down" />
                </Button>
              </Button.Group>
            </div>
          </h4>

          <Table
            columns={placeColumns}
            dataSource={dataSource}
            expandedRowRender={record => <p className="no-margin">{record.description}</p>}
          />
        </div>
      </div>
    )
  }
}

const FETCH_PLACES = gql`
  query FetchPlaces {
    allPlaces {
      id
      createdAt
      placeName
      description
      addressCityTown
      addressCountry
      source
      status
      createdBy {
        id
        username
      }
    }
  }
`

const PlacesScreen = graphql(FETCH_PLACES, {
  name: 'fetchPlaces',
  options: {
    fetchPolicy: 'network-only',
  },
})(Places);

export default PlacesScreen;
