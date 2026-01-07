import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';

const BlockWrapper = styled.div`
  color: ${({ theme }) => theme.color.bluePrimary};
  display: grid;
  gap: 4.8rem;
  grid-template-columns: repeat(1, 1fr);
  margin-bottom: 4.8rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Block = styled.div``;

const Title = styled(Typography, { shouldForwardProp: (prop) => prop !== 'coreValues' })`
  letter-spacing: 1px;
  margin-bottom: ${({ coreValues }) => (coreValues ? '0.8rem' : '2.4rem')};
  text-transform: uppercase;

  ${(props) => props.coreValues && css`
    font-size: 2.4rem;
    font-family: ${props.theme.font.heading};
    line-height: 4rem;
    text-transform: capitalize;

    @media (min-width: ${props.theme.breakpoint.medium}) {
      font-size: 3.2rem;
    }
  `}
`;

const Text = styled(Typography)``;

const Blocks = (props) => (
  <BlockWrapper>
    {props.data.map((block, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Block key={index}>
        {block.icon}
        <Title element="h5" like="dec-5" coreValues={props.coreValues}>{block.title}</Title>
        <Text element="p" like="dec-3">{block.text}</Text>
      </Block>
    ))}
  </BlockWrapper>
);

Blocks.propTypes = {
  data: PropTypes.array.isRequired,
  coreValues: PropTypes.bool
};

Blocks.defaultProps = {
  coreValues: false
};

export default Blocks;
