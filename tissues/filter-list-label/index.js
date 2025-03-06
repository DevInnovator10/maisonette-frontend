import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const LabelWrapper = styled(Typography)`
  appearance: none;
  ${(props) => props.theme.arrow(props.active ? 'up' : 'down', props.theme.color.white, 'right 1px center', 4)}
  background-color: transparent;
  border: 0 none;
  color: ${(props) => props.theme.color.white};
  cursor: pointer;
  display: block;
  line-height: 4rem;
  outline: none;
  padding: 0;
  position: relative;
  text-align: left;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    ${(props) => props.theme.arrow(props.active ? 'up' : 'down', props.theme.color.brand, 'right 1px center', 4)}
    color: ${(props) => props.theme.color.brand};
  }
`;

const FilterListLabel = (props) => (
  <LabelWrapper
    active={props.isOpened ? 'true' : undefined}
    aria-expanded={props.isOpened}
    className={props.className}
    element="button"
    like="dec-1"
    onClick={() => props.setOpened(props.isOpened ? false : props.category.id)}
    type="button"
  >
    {props.category.name}
  </LabelWrapper>
);

FilterListLabel.defaultProps = {
  className: ''
};

FilterListLabel.propTypes = {
  className: PropTypes.string,
  setOpened: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired
};

export default FilterListLabel;
