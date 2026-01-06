import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Heading = styled(Typography)`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.brand};
  letter-spacing: 0.2rem;
  margin-bottom: 1rem;
  min-height: 4rem;
  line-height: 4rem;
  text-transform: uppercase;

  > span {
    color: ${(props) => props.theme.color.brandA11yRed};
  }
`;

const Filter = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 2rem;
`;

const Loading = styled.span`
  position: relative;
  display: block;
  margin-top: 2rem;

  ${(props) => props.theme.loader(2)}
`;

const PetiteShopFor = (props) => {
  const [petite, setPetite] = useState(
    Object.prototype.hasOwnProperty.call(props.petites, 'minis') && props.petites.minis.find((p) => p.id === props.activeMini)
  );

  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(props.petites, 'minis') && !props.loadingMinis) {
      setPetite(props.petites?.minis.find((p) => p.id === props.activeMini));
    }
  }, [props.activeMini, props.loadingMinis]);

  return (
    Object.prototype.hasOwnProperty.call(props.profile, 'email')
      && (
      <>
        { props.loadingMinis && <Loading /> }
        { petite && (
        <div>
          <Heading element="h2" like="label-1">
            Shop For
            {' '}
            <span>{petite.name}</span>
          </Heading>

          <ul>
            <Filter element="li" like="dec-1">
              Gender
              { petite.gender_taxons.map((t) => t.name).filter((t) => ['Boy', 'Girl'].includes(t)).length > 1 ? 's' : ''}
              {': '}
              { petite.gender_taxons.map((t) => t.name).filter((t) => ['Boy', 'Girl'].includes(t)).join(', ') }
            </Filter>

            <Filter element="li" like="dec-1">
              Age Range
              { petite.age_range_taxons.map((t) => t.name).length > 1 ? 's' : ''}
              {': '}
              { petite.age_range_taxons.map((t) => t.name).join(', ') }
            </Filter>
          </ul>
        </div>
        )}
      </>
      )
  );
};

PetiteShopFor.propTypes = {
  petites: PropTypes.object.isRequired,
  activeMini: PropTypes.number.isRequired,
  loadingMinis: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  petites: state.petites,
  activeMini: state.petites.active_mini,
  loadingMinis: state.petites.loading,
  profile: state.profile
});

const mapDispatchToProps = () => ({});

const ConnectedPetiteShopFor = connect(mapStateToProps, mapDispatchToProps)(PetiteShopFor);

PetiteShopFor.displayName = 'PetiteShopFor';

export default ConnectedPetiteShopFor;
