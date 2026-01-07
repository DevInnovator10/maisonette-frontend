import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../typography';

const Wrapper = styled.div`
  position: relative;
  background: ${({ theme }) => theme.color.backgroundLightBlue};
  padding: ${({ theme }) => theme.modularScale.sixteen};
  padding-left: 5.6rem;
`;

const Text = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.eighteen};
`;

const ExclamationWrapper = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.color.white};
  text-align: center;
  width: 2.4rem;
  top: ${({ theme }) => theme.modularScale.sixteen};
  left: ${({ theme }) => theme.modularScale.sixteen};
  border-radius: 50%;
`;

const InfoBox = (props) => (
  <Wrapper>
    <ExclamationWrapper>
      !
    </ExclamationWrapper>
    <Text element="p" like="dec-2">
      {props.text}
    </Text>
  </Wrapper>
);

InfoBox.propTypes = {
  text: PropTypes.string.isRequired
};

export default InfoBox;
