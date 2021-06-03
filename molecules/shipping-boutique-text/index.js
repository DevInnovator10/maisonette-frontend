import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Flag from 'react-flagkit';
import Typography from '../../atoms/typography';

const StyledContainer = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.brand};
  display: flex;
  flex-wrap: wrap;
  line-height: 1.3;
  min-height: 2rem;

  img[role="img"] {
    display: inline-block;
  }

  > p {
    display: flex;
  }
`;

const Boutique = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};

  > span {
    color: ${(props) => props.theme.color.brand};
  }
`;

const Excluded = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  
  > summary {
    cursor: pointer;
    outline: 0;
    user-select: none;

    ~ p {
      border-left: 1px solid ${(props) => props.theme.color.brandError};
      line-height: 1.2;
      margin-bottom: 0.5rem;
      margin-left: 1.3rem;
      padding-left: 1rem;
    }
  }
`;

const ShippingBoutiqueText = (props) => {
  const [country, setCountry] = useState(props.country);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (country !== props.country) {
      setCountry(props.country);
    }
  }, [props.country]);

  const handleOnDetailsClick = (e) => setHidden(e.currentTarget.hasAttribute('open'));

  return (
    <>
      <StyledContainer className={props.className}>
        <Boutique element="p" like="dec-1">
          <Typography element="span" like="dec-1">Ships from:</Typography>
          &nbsp;
          {props.boutique}
          &nbsp;
          {country && <Flag country={country} size={16} />}
        </Boutique>
      </StyledContainer>

      {
        +props.threshold && props.country?.toLowerCase() !== 'us' && props.domesticOverride === false
          ? (
            <Excluded element="details" like="dec-1" onClick={handleOnDetailsClick}>
              <summary
                title="Domestic Ground Shipping includes products
                sent from domestic brands and boutiques only.
                International boutiques, expedited, and
                freight shipping are excluded."
              >
                Excluded from free shipping
                <i aria-label="More Information" />
              </summary>
              <p aria-hidden={hidden}>
                Domestic Ground Shipping includes products
                sent from domestic brands and boutiques only.
                International boutiques, expedited, and
                freight shipping are excluded.
              </p>
            </Excluded>
          ) : null
      }
    </>
  );
};

ShippingBoutiqueText.defaultProps = {
  className: '',
  country: 'us',
  threshold: '0',
  domesticOverride: false
};

ShippingBoutiqueText.propTypes = {
  boutique: PropTypes.string.isRequired,
  className: PropTypes.string,
  country: PropTypes.string,
  threshold: PropTypes.string,
  domesticOverride: PropTypes.bool
};

export default memo(ShippingBoutiqueText);
