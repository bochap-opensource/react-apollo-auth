import React from 'react';
import PropTypes from 'prop-types';
const Home = (props) => {
  const {
    history, getCurrentCredential: { credential: { token } }
  } = props;

  return (
    <div>
      { !token && <button onClick={ () => { history.push('/login'); } }>Login</button> }
      { token && <button onClick={ () => { history.push('/logout'); } }>Sign Out</button> }
    </div>
  );
};

Home.propTypes = {
  getCurrentCredential: PropTypes.shape({
    credential: PropTypes.shape({
      token: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
  , history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default Home;
