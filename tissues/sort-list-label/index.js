import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const LabelWrapper = styled(Typography)`
  appearance: none;
  ${(props) => props.theme.arrow(props.active ? 'up' : 'down', props.theme.color.brand, 'right 1px center', 4)}
  background-color: transparent;
  border: 0 none;
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  display: block;
  line-height: 4rem;
  outline: none;
  padding: 0;
  position: relative;
  text-align: left;
  width: 100%;
`;

const SortListLabel = (props) => (
  <LabelWrapper
    active={props.isOpened ? 'true' : undefined}
    aria-expanded={props.isOpened}
    className={props.className}
    element="button"
    like="dec-1"
    onClick={() => props.setOpened(!props.isOpened)}
    type="button"
  >
    {props.activeSort.name}
  </LabelWrapper>
);

SortListLabel.defaultProps = {

  className: ''
};

SortListLabel.propTypes = {
  className: PropTypes.string,
  setOpened: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
  activeSort: PropTypes.object.isRequired
};

export default SortListLabel;
