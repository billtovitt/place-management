import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import PlaceForm from './components/PlaceForm';
import { parseFormErrors } from '../shared/utils/form_errors';

class EditPlace extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(values) {
    const { match: { params }, updatePlace, push } = this.props;
    return updatePlace({ variables: { ...values, id: params.id } })
      .then(() => push('/places'))
      .catch(parseFormErrors);
  }

  handleDelete() {
    const { match: { params }, deletePlace, push } = this.props;
    deletePlace({ variables: { id: params.id } })
      .then(() => push('/places'));
  }

  render() {
    const { fetchPlace: { loading, Place } } = this.props;
    if (loading) {
      return <div className="loader-indicator" />;
    }

    return (
      <div id="edit-place">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/places">Places</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Edit Place</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          <h3>Edit Place</h3>

          <PlaceForm
            initialValues={Place}
            pictureURL={Place.pictureURL}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}

const DELETE_PLACE = gql`
  mutation DeletePlace($id: ID!) {
    deletePlace(id: $id) {
      id
    }
  }
`

const FETCH_PLACE = gql`
  query FetchPlace($id: ID!) {
    Place(id: $id) {
      createdAt
      placeName
      description
      address
      addressStreet
      addressAreaDistrict
      addressCityTown
      addressStateProvince
      addressCountry
      addressPostalCode
      locationLat
      locationLong
      source
      sourceId
      pictureURL
      status
    }
  }
`
const UPDATE_PLACE = gql`
  mutation UpdatePlace(
    $id: ID!,
    $placeName: String!,
    $description: String,
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
    $status: PlaceStatus!,
  ) {
    updatePlace (
      id: $id
      placeName: $placeName
      description: $description
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
      status: $status
    ) {
      placeName
      description
      address
      addressStreet
      addressAreaDistrict
      addressCityTown
      addressStateProvince
      addressCountry
      addressPostalCode
      locationLat
      locationLong
      source
      sourceId
      pictureURL
      createdAt
      status
    }
  }
`

const EditPlaceScreen = compose(
  graphql(FETCH_PLACE, {
    name: 'fetchPlace',
    options: ({ match }) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_PLACE, {
    name: 'updatePlace',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_PLACE, {
    name: 'deletePlace',
    options: {
      fetchPolicy: 'network-only',
    },
  })
)(EditPlace);

export default connect(null, { push })(EditPlaceScreen);
