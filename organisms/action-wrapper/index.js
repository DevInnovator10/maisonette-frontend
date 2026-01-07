import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const ActionWrapper = (props) => (
  <>
    {
      React.cloneElement(props.children, {
        [props.handler]: () => {
          props.dispatch(
            props.action(props.data)
          );
        }
      })
    }
  </>
);

ActionWrapper.defaultProps = {
  data: undefined,
  dispatch: () => {}
};

ActionWrapper.propTypes = {
  action: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  data: PropTypes.any,
  dispatch: PropTypes.func,
  handler: PropTypes.string.isRequired
};

export default connect()(ActionWrapper);
