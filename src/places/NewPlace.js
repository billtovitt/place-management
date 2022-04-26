import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import PlaceForm from './components/PlaceForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class NewPlace extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { push, createPlace, loggedInUserQuery: { loggedInUser } } = this.props;
    return createPlace(
      {
        variables: {
          ...values,
          locationLat: parseFloat(values.locationLat),
          locationLong: parseFloat(values.locationLong),
          createdById: loggedInUser && loggedInUser.id,
        }
      })
      .then(() => push('/places'))
      .catch(parseFormErrors);
  }

  render() {
    const initialValues = {
      createSide: 'FRONTEND',
    }
    return (
      <div id="new-place">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/places">Places</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Place</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>New Place</h3>

          <PlaceForm
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

const CREATE_PLACE = gql`
  mutation CreatePlace(
    $placeName: String!,
    $description: String,
    $createSide: CreateSide!,
    $address: String,
    $addressStreet: String,
    $addressAreaDistrict: String,
    $addressCityTown: String,
    $addressStateProvince: String,
    $addressCountry: String,
    $addressPostalCode: String,
    $locationLat: Float,
    $locationLong: Float,
    $source: PlaceSource!,
    $sourceId: String,
    $pictureURL: [String!],
    $createdById: ID,
    $status: PlaceStatus!
  ) {
    createPlace(
      placeName: $placeName
      description: $description
      createSide: $createSide
      address: $address
      addressStreet: $addressStreet
      addressAreaDistrict: $addressAreaDistrict
      addressCityTown: $addressCityTown
      addressStateProvince: $addressStateProvince
      addressCountry: $addressCountry
      addressPostalCode: $addressPostalCode
      locationLat: $locationLat
      locationLong: $locationLong
      source: $source
      sourceId: $sourceId
      pictureURL: $pictureURL
      createdById: $createdById
      status: $status
    ) {
      id
    }
  }
`

const NewPlaceScreen = compose(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only',
    }
  }),
  graphql(CREATE_PLACE, {
    name: 'createPlace',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(NewPlace);

export default connect(null, { push })(NewPlaceScreen);
