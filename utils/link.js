/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */

import React, { forwardRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import { isAbsolute } from './navigation';

const LinkWrap = ({ children, refAs, ...rest }, ref) => {
  const props = rest;

  if (refAs) props[refAs] = ref;

  return (
    <>
      {
        React.isValidElement(children)
          ? React.cloneElement(children, props)
          : null
      }
    </>
  );
};

const LinkWrapper = forwardRef(LinkWrap);

const Link = ({ refAs, children, ...props }) => {
  const link = props?.as ?? props.href;
  const { type, props: childrenProps } = children;

  if (isAbsolute(link)) {
    return (
      type?.__emotion_base === 'a'
        ? cloneElement(children, { ...childrenProps, ...props, href: link })
        : <a ref={refAs} href={link}>{children}</a>
    );
  }

  return (
    <NextLink {...props}>
      <LinkWrapper refAs={refAs} {...childrenProps}>{children}</LinkWrapper>
    </NextLink>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

export default Link;
