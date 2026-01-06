import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Picture from '../../atoms/picture';
import Ruler from '../../atoms/ruler';

const DesktopImage = styled(Picture)`
  margin-bottom: ${(props) => props.theme.modularScale.large};
  margin-left: auto;
  margin-right: auto;
  max-width: 1090px;
  display: none;
  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
  }
`;

const MobileImage = styled(Picture)`
  margin-bottom: ${(props) => props.theme.modularScale.large};
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  display: block;
  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: none;
  }
`;

const ImageBanner = (props) => (
  <>
    {props.data?.image_banner_image_desktop && (
      <DesktopImage
        {...props.data.image_banner_image_desktop}
        alt={props.data?.image_banner_image_alt_text ?? ''}
      />
    )}
    {props.data?.image_banner_image_mobile && (

      <MobileImage
        {...props.data.image_banner_image_mobile}
        alt={props.data?.image_banner_image_alt_text ?? ''}
      />
    )}
    { props.data?.image_banner_hr && <Ruler /> }
  </>
);

ImageBanner.propTypes = {
  data: PropTypes.object.isRequired
};

ImageBanner.whyDidYouRender = true;

export default ImageBanner;
