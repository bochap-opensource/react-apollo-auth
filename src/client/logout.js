import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import { currentCredentialQuery, getCurrentCredential } from './query';
import { BASE_URI } from '../constants';

class Logout extends React.Component {
  async componentDidMount() {
    const { client } = this.props;

    // Clear the cookie
    const result = await fetch(`${BASE_URI}/credentialCookie`, {
      method: 'DELETE'
      , headers: {
        'Content-Type': 'application/json'
      }
      , credentials: 'same-origin'
    });

    const credential = {
      name: ''
      , email: ''
      , token: ''
      , __typename: 'Credential'
    };

    // Clear the cache of the credential, using refetchQueries with fetchPolicy 'cache-only'
    // client.resetStore seems to make the query to the network.
    client.writeQuery({
      query: currentCredentialQuery
      , data: { credential }
    });
  }

  render() {
    const { history } = this.props;
    return (
      <div>
        <h3>You have been logged out of the system.</h3>
        <input
          type="submit"
          value="Home"
          onClick={ () => { history.push('/'); } }
        />
      </div>
    );
  }
}

Logout.propTypes = {
  client: PropTypes.shape({
    writeQuery: PropTypes.func.isRequired
  }).isRequired
  , history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default Logout;
