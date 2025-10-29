import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import Typography from '../../atoms/typography';

const Section = styled.section`
  color: ${(props) => props.theme.color.brand};
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Meter = styled.progress`
  appearance: none;
  border-radius: 0.5rem;
  width: 100%;
  height: 1rem;

  ::-webkit-progress-bar {
    background-color: ${({ theme }) => theme.color.background};
    border-radius: 0.5rem;
  }

  ::-webkit-progress-value {
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.color.brand};
    transition: width 200ms linear;
  }
`;

const Highlight = styled(Typography)`
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.brandA11yRed};
`;

const Text = styled(Typography)`
  text-align: center;

  & ~ ${Meter} {
    margin-top: 1rem;
  }
`;

const TextFlair = styled(Typography)`
  align-self: center;
  color: ${({ theme }) => theme.color.brandA11yRed};
  letter-spacing: 0.1em;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  padding: 0 ${({ theme }) => theme.modularScale.base};

  background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/wings-left.svg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/wings-right.svg);
  background-position: 0, 100%;
  background-repeat: no-repeat;
  background-size: 12px;
`;

const FreeShipping = (props) => {
  const [progressTotal, setProgressTotal] = useState(props.progressTotal);
  const [goal] = useState(+props.threshold);

  useEffect(() => {
    setProgressTotal(props.progressTotal);
  }, [props.progressTotal]);

  return +props.threshold ? (
    <Section className={props.className}>
      {
        progressTotal < goal
          ? (
            <Text element="p" like="dec-1">
              {
                progressTotal >= goal / 2
                  ? <span>So close!</span>
                  : <span>Keep shopping!</span>
              }
              {' '}
              Add
              {' '}
              <Highlight element="span" like="label-1" className="highlight">
                {formatMoney(goal - progressTotal)}
              </Highlight>
              {' '}
              for
              {' '}
              <Highlight element="span" like="label-1" className="highlight">FREE GROUND SHIPPING</Highlight>
            </Text>
          ) : (
            <TextFlair element="p" like="label-1">
              DOMESTIC GROUND SHIPPING&apos;S ON US
            </TextFlair>
          )
      }

      {
        progressTotal < goal && <Meter value={(progressTotal / goal) * 100} max={100} />
      }
    </Section>
  ) : null;
};

FreeShipping.defaultProps = {
  className: '',
  threshold: '0'
};

FreeShipping.propTypes = {
  className: PropTypes.string,

  progressTotal: PropTypes.string.isRequired,
  threshold: PropTypes.string
};

FreeShipping.whyDidYouRender = true;

export default FreeShipping;
