import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import { currentCredentialQuery } from './query';
import { BASE_URI } from '../constants';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: []
    };
  }

  handleChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handleSubmit = async (event) => {
    const { createCredential, history, client } = this.props;
    const { data } = await createCredential({
      variables: { email: this.state.email }
    })

    if (data.errors) {
      this.setState({ errors: data.errors });
      return;
    }

    const credential = {
      ...data.createCredential
      , __typename: 'Credential'
    };

    // This writes to the in memory cache the credential obtained from the GraphQl server
    // This allows the authentication token to be found on the cache without hitting the server
    client.writeQuery({
      query: currentCredentialQuery
      , data: { credential }
    });

    const result = await fetch(`${BASE_URI}/credentialCookie`, {
      method: 'POST'
      , body: JSON.stringify({
        token: credential.token
        , expiryInDays: 1
      })
      , headers: {
        'Content-Type': 'application/json'
      }
      , credentials: 'same-origin'
    });

    history.push('/');
  }

  render() {
    return (
        <div>
          <p>
            Email: <input
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </p>
          <p>
            <input
              type="submit"
              value="Login"
              onClick={this.handleSubmit}
            />
          </p>
          {
            this.state.errors.length > 0 && this.state.errors.reduce((item, index) => (
              <p key={index}>{item}</p>
            ))
          }
        </div>
    );
  }
};

Login.propTypes = {
  createCredential: PropTypes.func.isRequired
  , history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
  , client: PropTypes.shape({
    writeQuery: PropTypes.func.isRequired
  }).isRequired
};

export default Login;
