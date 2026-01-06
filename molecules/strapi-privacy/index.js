import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Text = styled(Typography)`
  line-height: 1.5;
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 3rem;
  }

  b {
    font-weight: bold;
  }
`;

const PrivacyWrapper = styled.section`
  color: ${({ theme }) => theme.color.brand};
  margin-bottom: -2rem;

  &.bb {
    border-bottom: 1px solid ${({ theme }) => theme.color.brand};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin-bottom: -3rem;
  }
`;

const Title = styled(Typography)`
  margin-top: 1rem;
  margin-bottom: 2rem;
  letter-spacing: 0.04em;

  b {
    font-weight: bold;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    :not(:first-of-type) {
      margin-top: 0;
    }
  }
`;

const Privacy = (props) => (
  <PrivacyWrapper className={props.privacy_hr ? 'bb' : ''}>
    {
      props?.privacy_heading
        && <Title element="h2" like="dec-1" dangerouslySetInnerHTML={{ __html: props.privacy_heading }} />

    }

    {
      typeof (props.privacy_elements) === 'object'
        ? Object.keys(props.privacy_elements).map((k) => (
          <Text
            key={`privacy-${k}`}
            dangerouslySetInnerHTML={{ __html: props.privacy_elements[k].privacy_text }}
            element="div"
            like="paragraph-2"
          />
        ))
        : (
          <Text
            dangerouslySetInnerHTML={{ __html: props.privacy_elements }}
            element="div"
            like="paragraph-2"
          />
        )
    }

  </PrivacyWrapper>
);

Privacy.propTypes = {
  privacy_heading: PropTypes.string.isRequired,
  privacy_elements: PropTypes.object.isRequired,
  privacy_hr: PropTypes.bool.isRequired
};

export default memo(Privacy);
