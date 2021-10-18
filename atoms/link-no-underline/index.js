import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';

import Link from '../../utils/link';
import { isAbsolute } from '../../utils/navigation';

const StyledAnchor = styled.a`
  text-decoration: none;
  ${(props) => props.fullWidth && css`
    width: 100%;
  `}
`;

const LinkNoUnderline = (props) => {
  if (isAbsolute(props.href?.pathname)) {
    return (
      <Link href={props.href?.pathname ?? props.href} passHref>
        <StyledAnchor fullWidth={props.fullWidth}>
          {props.children}
        </StyledAnchor>

      </Link>
    );
  }

  return (
    <Link href={props.href} passHref>
      <StyledAnchor fullWidth={props.fullWidth}>
        {props.children}
      </StyledAnchor>
    </Link>
  );
};

LinkNoUnderline.defaultProps = {
  href: '#',
  children: '',
  fullWidth: false
};

LinkNoUnderline.propTypes = {
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.any,
  fullWidth: PropTypes.bool
};

export default LinkNoUnderline;
