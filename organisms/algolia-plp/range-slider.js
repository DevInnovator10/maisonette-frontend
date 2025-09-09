import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Rheostat from 'rheostat';
import styled from '@emotion/styled';
import { connectRange } from 'react-instantsearch-dom';
import { formatMoney } from 'accounting-js';
import { useRouter } from 'next/router';

import 'rheostat/initialize';
import 'rheostat/css/rheostat.css';

import { Accordion, AccordionPanel, AccordionTrigger } from './left-rail-shared';
import refinementMap from './utils/refinement-map.json';
import Typography from '../../atoms/typography';
import { logAmplitude } from '../../utils/amplitude';

const Container = styled.div(() => ({
  width: 'calc(100% - 16px)',
  marginLeft: 8
}));

const Wrapper = styled.div(({ theme }) => ({
  marginTop: '3rem',
  marginBottom: '2rem',
  '.DefaultBackground': {
    height: 5,
    top: 0,
    left: 0,
    bottom: 'unset',
    border: 0,
    background: theme.color.brandLight
  },
  '.handleContainer': {
    height: 5,
    top: 0,
    left: 0,
    bottom: 'unset'
  },
  '.DefaultProgressBar_background__horizontal': {
    height: 5
  },
  '.DefaultProgressBar_progressBar': {
    background: theme.color.white
  },
  '.DefaultHandle_handle': {
    top: 7,
    boxShadow: 'none',
    background: theme.color.white,
    border: `2px solid ${theme.color.brand}`,
    borderRadius: '100%',
    cursor: 'pointer',
    display: 'block',
    height: 16,
    marginLeft: -8,
    marginTop: -12,
    width: 16,
    '::before, ::after': {
      content: 'none'
    }
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    '.DefaultProgressBar_progressBar': { background: theme.color.brand },
    '.DefaultHandle_handle': { background: theme.color.white }
  }
}));

const RheostatValues = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  pointerEvents: 'none',
  position: 'absolute',
  top: -30,
  width: 'calc(100% + 16px)',
  left: -8
}));

const RangeMin = styled(Typography)`
  color: ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const RangeMax = styled(Typography)`
  color: ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const Left = styled.div(() => ({ left: 0 }));
const Right = styled.div(() => ({ right: 0 }));

const RangeSlider = ({
  min,
  max,
  currentRefinement,
  canRefine,
  refine
}) => {
  const router = useRouter();

  const [stateMin, setStateMin] = useState(min);
  const [stateMax, setStateMax] = useState(max);

  useEffect(() => {
    if (canRefine) {
      setStateMin(currentRefinement.min);
      setStateMax(currentRefinement.max);
    }
  }, [currentRefinement.min, currentRefinement.max]);

  if (min === max) {
    return null;
  }

  const onChange = ({ values: [newMin, newMax] }) => {
    if (currentRefinement.min !== newMin || currentRefinement.max !== newMax) {
      refine({ min: newMin, max: newMax });
      const facets = router.query?.af?.replaceAll('+', ';');
      const navigationItem = `sprice:[${newMin},${newMax}]`;

      logAmplitude('Clicked Facet', {
        navigationItem,
        filterAction: 'Filter Applied',

        selected: true,
        facets
      });
    }
  };

  const onValuesUpdated = ({ values: [newMin, newMax] }) => {
    setStateMin(newMin);
    setStateMax(newMax);
  };

  return (
    <Wrapper>
      <Container>
        <Rheostat
          min={min}
          max={max}
          values={[currentRefinement.min, currentRefinement.max]}
          onChange={onChange}
          onValuesUpdated={onValuesUpdated}
        >
          <RheostatValues>
            <Left className="rheostat-marker rheostat-marker--large">
              <RangeMin className="rheostat-value" element="span" like="label-1">
                {formatMoney(stateMin, { precision: 0 })}
              </RangeMin>
            </Left>

            <Right className="rheostat-marker rheostat-marker--large">
              <RangeMax className="rheostat-value" element="span" like="label-1">
                {formatMoney(stateMax, { precision: 0 })}
              </RangeMax>
            </Right>
          </RheostatValues>
        </Rheostat>
      </Container>
    </Wrapper>
  );
};

RangeSlider.defaultProps = {
  min: 0,
  max: 0
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  currentRefinement: PropTypes.object.isRequired,
  canRefine: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired
};

const ConnectedRangeSlider = connectRange(RangeSlider);

const RangeSliderRefinement = ({ attribute }) => {
  const router = useRouter();
  const ref = useRef();
  const [active, toggle] = useState(false);

  const onTriggerClick = () => {
    // TODO: Facets needs to be updated because its using SLI logic that is broken
    const facets = router.query?.af?.replaceAll('+', ';');
    const navigationItem = refinementMap[attribute].id;
    const selected = !active;

    logAmplitude('Clicked Facet', {
      navigationItem,
      filterAction: 'Filter Clicked',
      selected,
      facets
    });

    toggle(!active);
  };

  return (
    <Accordion ref={ref}>
      <AccordionTrigger
        isOpened={active}
        aria-expanded={active}
        onClick={onTriggerClick}
      >
        {refinementMap[attribute].label}
      </AccordionTrigger>

      <AccordionPanel active={active}>
        <ConnectedRangeSlider attribute={attribute} />
      </AccordionPanel>
    </Accordion>
  );
};

RangeSliderRefinement.defaultProps = {
  attribute: 'variants.maisonette_sale'
};

RangeSliderRefinement.propTypes = {
  attribute: PropTypes.string
};

export default RangeSliderRefinement;
