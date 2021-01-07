import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';

const StyledLink = styled.div`
    align-self: center;
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  opacity: 0.75;
  text-align: center;
  transition: opacity 400ms;

  :hover {
    opacity: 1;
  }

  p {
    color: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brand)};
    margin-bottom: ${(props) => (props.primaryText ? '1.5rem' : '')};
    order: ${(props) => (props.primaryText ? 1 : 2)};
    text-align: center;
  }

  svg {
    fill: transparent;
    height: 26px;
    margin-bottom: ${(props) => (props.primaryText ? '' : '0.25rem')};
    order: ${(props) => (props.primaryText ? 2 : 1)};
    overflow: visible;
    stroke: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brand)};
    width: 26px;
  }
`;

const LinkText = styled(Typography)`
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const IconLink = (props) => (
  <Link href={props.link} passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a tabIndex={props.tabIndex}>
      <StyledLink primaryText={props.primaryText} inverted={props.inverted}>
        {props.children}
        <LinkText element="p" like="label-1">{props.text}</LinkText>
      </StyledLink>
    </a>
  </Link>

);

IconLink.defaultProps = {
  tabIndex: 0,
  primaryText: false,
  inverted: false
};

IconLink.propTypes = {
  tabIndex: PropTypes.number,
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  inverted: PropTypes.bool,
  primaryText: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default IconLink;
