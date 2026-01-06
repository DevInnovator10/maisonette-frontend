import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Picture from '../../atoms/picture';
import Ruler from '../../atoms/ruler';

const Wrapper = styled.section`
    display: flex;
  justify-content: space-between;
`;

const Image = styled(Picture)`
  flex: 0 0 auto;
  width: 50%;

  &:nth-of-type(1) {
    padding-right: ${(props) => props.theme.modularScale.base};
  }

  &:nth-of-type(2) {
    padding-left: ${(props) => props.theme.modularScale.base};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding: 0 ${(props) => props.theme.modularScale.large};
  }
`;

const TwoImage = (props) => (
  <>
    <Wrapper>
      {props.data?.two_image_left_image_desktop
      && (
        <Image
          {...props.data.two_image_left_image_desktop}
          alt={props.data.two_image_left_alt_text}
        />
      )}
      {props.data?.two_image_right_image_desktop
      && (
        <Image
          {...props.data.two_image_right_image_desktop}
          alt={props.data.two_image_right_alt_text}
        />
      )}
    </Wrapper>
    { props.data?.two_image_hr && <Ruler /> }
  </>
);

TwoImage.propTypes = {
  data: PropTypes.object.isRequired
};

TwoImage.whyDidYouRender = true;

export default memo(TwoImage);
