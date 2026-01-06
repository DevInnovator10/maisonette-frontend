import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useScript from './hooks/useScript';

// eslint-disable-next-line react/destructuring-assignment
const Script = (props) => {
  const [loaded] = useScript(
    `https://static.zdassets.com/ekr/snippet.js?key=${process.env.ZENDESK_API_KEY}`, {
      id: 'ze-snippet'
    }
  );

  useEffect(() => {
    if (loaded) props.setLoaded(true);
  }, [loaded]);

  return <span />;
};

Script.propTypes = {
  setLoaded: PropTypes.func.isRequired
};

export default Script;
