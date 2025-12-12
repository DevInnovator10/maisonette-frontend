import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const DiagonalLine = styled.div`
  position: absolute;
  width: 9px;
  height: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.color.bluePrimary};
  transform:
    translateY(-10.5px)
    translateX(-3.5px)
    rotate(45deg);
  -webkit-transform:
    translateY(-10.5px)
    translateX(-3.5px)
    rotate(45deg);
`;

const ArrowDiagonal = styled.div`
  position: absolute;
  display:inline-block;
  width: 7px;
  height: 7px;
  border: 1px solid ${({ theme }) => theme.color.bluePrimary};
  border-width: 0px 0px 1px 1px;
  display: inline-block;
  transform:
    translateY(-11px)
    translateX(-5px)
    rotate(90deg);
  -webkit-transform:
    translateY(-11px)
    translateX(-5px)
    rotate(90deg);
`;

const ArrowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DiagonalArrowWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'down' })`
  display: flex;
  position: absolute;

  ${({ down }) => (down && css`
    transform:
      translateY(-3.5px)
      translateX(8.5px)
      rotate(180deg);

    -webkit-transform:
      translateY(-3.5px)
      translateX(8.5px)
      rotate(180deg);
  `)}
`;

const DiagonalArrow = ({ down }) => (
  <DiagonalArrowWrapper down={down}>
    <ArrowDiagonal />
    <DiagonalLine />
  </DiagonalArrowWrapper>
);

DiagonalArrow.defaultProps = {
  down: false
};

DiagonalArrow.propTypes = {
  down: PropTypes.bool
};

const HiddenButton = styled.button`
  border: none;
  position: absolute;
  width: 30px;
  height: 30px;
  left: 85%;
  background: none;
  cursor: zoom-in;

  transform: translateY(-45px);
  -webkit-transform: translateY(-45px);
`;

const ArrowSign = ({ handleZoomButtonClick }) => (
  <HiddenButton
    onClick={() => {
      handleZoomButtonClick();
    }}
  >
    <ArrowsWrapper>
      <DiagonalArrow />
      <DiagonalArrow down />
    </ArrowsWrapper>
  </HiddenButton>
);

ArrowSign.propTypes = {
  handleZoomButtonClick: PropTypes.func.isRequired
};

export default ArrowSign;
