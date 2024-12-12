import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getHref } from '../../utils/navigation';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import Picture from '../../atoms/picture';

const NewsletterItemAnchor = styled.a`
  align-items: center;
  color: ${(props) => props.theme.color.white};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  text-decoration: none;
  width: 33.33333%;
`;

const NewsletterItem = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.white};
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  text-decoration: none;
  width: 33.33333%;
`;

const NewsletterItemText = styled(Typography)`
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .25rem;
  line-height: 1.5rem;
`;

const NewsletterImageWrapper = styled(Picture)`
  display: block;
  height: 7.5rem;
  margin: 0 auto 1.5rem;
  position: relative;
  width: 7.5rem;

  img {
    border-radius: 50%;
    object-fit: cover;
  }
`;

const NewsletterFlavorCopy = (props) => {
  if (props.href) {
    return (
      <Link
        href={getHref({ navigation_url: props.href })}
        passHref
      >
        <NewsletterItemAnchor>
          <NewsletterImageWrapper {...props.image} alt={props.alt} />
          <NewsletterItemText element="p" like="label-1">{props.title}</NewsletterItemText>
        </NewsletterItemAnchor>
      </Link>
    );
  }

  return (
    <NewsletterItem>
      <NewsletterImageWrapper {...props.image} alt={props.alt} />
      <NewsletterItemText element="p" like="label-1">{props.title}</NewsletterItemText>
    </NewsletterItem>
  );
};

NewsletterFlavorCopy.defaultProps = {
  href: null,
  alt: ''
};

NewsletterFlavorCopy.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  image: PropTypes.object.isRequired,
  alt: PropTypes.string

};

export default NewsletterFlavorCopy;
