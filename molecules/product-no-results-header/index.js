import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};

  line-height: 1.4;
  text-align: center;

  ~ p {
    margin-top: 2rem;
  }
`;

const PetiteProfileName = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  text-align: center;

  > span {
    color: ${(props) => props.theme.color.brandA11yRed};
    display: block;

    @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
      margin-left: 0.5rem;
      display: inline;
    }
  }
`;

const Filters = styled.span`
  font-weight: 600;
  text-align: center;
`;

const NoResultsSubHeading = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  text-align: center;
  margin-bottom: 6rem;
`;

const ProductNoResults = (props) => (
  <>
    {
      props.slug !== '*' && props.noResultsWithMiniRemoved && (
        <>
          <Title element="h2" like="heading-3">
          Sorry! We were unable to find any results for
            {
              props.facets.length > 0
                ? <Filters>{` "${props.facets.map((f) => f.name).join(' + ')}"`}</Filters>
                : <Filters>{` "${props.slug}"`}</Filters>
            }
          </Title>

          <NoResultsSubHeading element="p" like="dec-1">
          You may have typed your word incorrectly, or are being too specific.
          Try using a broader search phrase or try one of our most popular search phrases.
          </NoResultsSubHeading>
        </>
      )
    }

    {
      props.miniName && (
        <>
          <Title element="h2" like="heading-4">
            Sorry! We were unable to find any results including
          </Title>

          <PetiteProfileName element="h3" like="heading-4">
            Petite Profile:
            <span>{` ${props.miniName}`}</span>
          </PetiteProfileName>

          <NoResultsSubHeading element="p" like="dec-2">
              Here are some related products
            {' '}
            {props.slug !== '*' ? 'based on your search' : ''}
          </NoResultsSubHeading>

        </>
      )
    }
  </>
);

ProductNoResults.defaultProps = {
  facets: [],
  miniName: null,
  noResultsWithMiniRemoved: false
};

ProductNoResults.propTypes = {
  facets: PropTypes.array,
  miniName: PropTypes.string,
  noResultsWithMiniRemoved: PropTypes.bool,
  slug: PropTypes.string.isRequired
};

export default ProductNoResults;
