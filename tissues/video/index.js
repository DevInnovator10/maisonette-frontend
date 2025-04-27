import React from 'react';
import PropTypes from 'prop-types';
import Video from '../../atoms/video';
import Ruler from '../../atoms/ruler';

const VideoCms = (props) => (
  <>
    <Video {...props.data} />
    { props.data?.video_hr && <Ruler /> }
  </>
);

VideoCms.propTypes = {
  data: PropTypes.object.isRequired
};

export default VideoCms;
