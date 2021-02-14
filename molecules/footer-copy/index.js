import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const ListItem = styled(Typography)`
  align-self: center;
  color: ${(props) => props.theme.color.white};
`;

const ItemLink = styled.a`
  color: ${(props) => props.theme.color.white};
  display: block;
  text-decoration: none;
  transition: color 400ms ${(props) => props.theme.animation.easeOutQuad};

  :hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const FooterCopy = (props) => (
  <StyledList {...props}>
    <ListItem element="li" like="dec-1">
      <ItemLink href={`tel:${props.phone.unformatted}`}>
        {props.phone.pretty}
        <br />
        {`(${props.phone.formatted})`}
      </ItemLink>
    </ListItem>
    <ListItem element="li" like="dec-1"><p>Mon—Fri: 10am—6pm Eastern</p></ListItem>
    <ListItem element="li" like="dec-1"><ItemLink href={`mailto:${props.email}`}>{props.email}</ItemLink></ListItem>
  </StyledList>
);

FooterCopy.propTypes = {
  email: PropTypes.string.isRequired,
  phone: PropTypes.objectOf(PropTypes.string).isRequired
};

export default FooterCopy;
