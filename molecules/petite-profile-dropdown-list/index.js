import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '../../atoms/button';
import Typography from '../../atoms/typography';

const hoverStyles = css`
  span {
    opacity: .75;

    ::before {
      opacity: .75;
    }
  }
`;

const List = styled.ul`
  margin-bottom: 3rem;

  :not(.is-empty) {
    li {
      cursor: pointer;

      :hover {
        ${hoverStyles}
      }
    }
  }
`;

const generalItemStyles = (props) => css`
  color: ${props.theme.color.white};
  line-height: 1;
  padding: 5px 0;
  text-align: center;
  ${(props.active ? hoverStyles : '')}
`;

const Item = styled(Button)`
  ${generalItemStyles}
  border: none;
  width: 100%;
  text-transform: none;
  letter-spacing: normal;
  font-family: ${(props) => props.theme.font.heading};
  font-size: ${(props) => props.theme.modularScale.large};

  ${(props) => (props.active ? hoverStyles : '')}
`;

const NoProfilesItem = styled(Typography)`
  margin-bottom: 3rem;
  text-align: center;
`;

const Inner = styled.span`
  position: relative;
  transition: opacity ${(props) => props.theme.animation.default};

  ::before {
    background-color: ${(props) => props.theme.color.white};
    bottom: 0;
    content: "";
    height: 1px;
    left: 0;
    opacity: 0;
    position: absolute;
    transition: opacity ${(props) => props.theme.animation.default};
    width: 100%;
  }
`;

const PetiteProfileDropdownList = (props) => {
  if (props.loading) {
    return (
      <NoProfilesItem element="h3" like="heading-5">
        Loading minis...
      </NoProfilesItem>
    );
  }

  if (props.petites.minis && props.petites.minis.length > 0) {
    return (
      <List aria-label="petite profile options">
        {
          props.petites.minis.map((mini) => (
            <li key={mini.id}>
              <Item
                aria-label={`select mini, ${mini.name}`}
                active={mini.id === props.activeMini}
                onClick={() => props.handleOnMiniClick(mini.id)}
              >
                <Inner>{mini.name}</Inner>
              </Item>
            </li>
          ))
        }

        <li>
          <Item
            aria-label="select everything"
            active={props.activeMini <= 0}
            onClick={() => props.handleOnMiniClick(0)}
          >
            <Inner>Everything</Inner>

          </Item>
        </li>
      </List>
    );
  }

  return (
    <NoProfilesItem element="h3" like="heading-5">
      Create your minis’ profile for custom recommendations
    </NoProfilesItem>
  );
};

PetiteProfileDropdownList.defaultProps = {
  activeMini: null
};

PetiteProfileDropdownList.propTypes = {
  activeMini: PropTypes.number,
  petites: PropTypes.object.isRequired,
  handleOnMiniClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

PetiteProfileDropdownList.whyDidYouRender = true;

export default PetiteProfileDropdownList;
