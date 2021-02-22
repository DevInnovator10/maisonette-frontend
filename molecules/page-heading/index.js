import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Heading = styled(Typography)`
  background-color: ${(props) => props.theme.color.background};
  color: ${(props) => props.theme.color.brand};
  padding-bottom: 5rem;
  padding-top: 5rem;
  text-align: center;
  position: relative;

  background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-right.jpg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-left.jpg);
  background-position: right, left;
  background-repeat: no-repeat, no-repeat;
`;

const PageHeading = (props) => (
  <Heading element="h1" like="heading-3">{props.title}</Heading>
);

PageHeading.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

PageHeading.whyDidYouRender = true;

export default PageHeading;
