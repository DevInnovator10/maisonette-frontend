import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

import Typography from '../../atoms/typography';

const Label = styled(Typography)`
  letter-spacing: 0.2em;
  line-height: 2rem;
  padding-left: 0.5rem;
  text-transform: uppercase;
`;

const Badge = styled.div`
  align-items: center;
  display: flex;
  height: 2rem;
  margin: 1rem;
  justify-content: center;

  ${Label} {
    color: ${(props) => props.theme.badges[props.badge]};
  }

  svg {
    fill: ${(props) => props.theme.badges[props.badge.toLowerCase().split(' ').join('')]};
    height: 2rem;
    width: 2rem;
  }
`;

const VALID_BADGES = [
  'Exclusive',
  'Monogrammable',
  'Selling Fast',
  'Just In',
  'Most Wished',
  'On Sale'
];

const ProductBadgeRevamp = (props) => {
  let badges = props.badges || [];

  if (props.badge) badges = [props.badge, ...badges];

  badges = badges
    .reduce((acc, curr) => {
      const badge = curr === 'Exclusives' ? 'Exclusive' : curr;
      if (VALID_BADGES.includes(badge)) acc.push(badge);
      return acc;
    }, []);

  if (badges.length === 0) return null;

  const badge = badges[0].toLowerCase().split(' ').join('');

  const Icon = dynamic(() => import(`../../atoms/icon-label-${badge}`));

  return (
    <Badge badge={badge}>
      <Icon />
      <Label element="span" like="label-4">{badges[0]}</Label>
    </Badge>
  );
};

ProductBadgeRevamp.defaultProps = {
  badge: '',
  badges: ''
};

ProductBadgeRevamp.propTypes = {
  badge: PropTypes.string,
  badges: PropTypes.string
};

ProductBadgeRevamp.whyDidYouRender = true;

export default ProductBadgeRevamp;
