import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import YouTube from 'react-youtube';

const StyledVideo = styled.div`
  .yt-video {
    position: relative;
    max-width: 100%;
    height: 0;
    padding-top: 56.25%;
    overflow: hidden;
    display: block;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

const options = {
  playerVars: {
    rel: 0
  }
};

const Video = (props) => (
  <StyledVideo {...props}>
    <YouTube
      containerClassName="yt-video"
      className="yt-frame"
      videoId={props.video_id}
      options={options}
    />
  </StyledVideo>
);

Video.propTypes = {
  video_id: PropTypes.string.isRequired
};

export default Video;
