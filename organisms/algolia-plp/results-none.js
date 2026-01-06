import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import router from 'next/router';
import { Content } from '../../theme/page';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.4;
  text-align: center;
  ~ p {
    margin-top: 2rem;
  }
`;

const NoResultsSubHeading = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  text-align: center;
  margin-bottom: 6rem;
  font-size: ${(props) => props.theme.modularScale.medium};
`;

const Filters = styled.span`
  font-weight: 600;
  text-align: center;
`;

const KeepShoppingButton = styled(Button)(() => ({
  display: 'flex',
  margin: '0 auto',
  width: 'fit-content'
}));

const ResultNone = ({
  searchState,
  searchResults,
  edit,
  trend
}) => {
  if (searchResults?.nbHits > 0 && searchResults?.page <= searchResults?.nbPages) {
    return null;
  }

  const facetFilters = searchState.refinementList
    ? Object.entries(searchState.refinementList)
      .reduce((acc, [attr, values]) => {
        const temp = acc;
        values.forEach((v) => temp.push(`${attr}:${v}`));
        return temp;
      }, [])
    : [];

  const categoryHeirarchy = searchState.hierarchicalMenu
    // eslint-disable-next-line max-len
    ? Object.values(searchState.hierarchicalMenu)[Object.values(searchState.hierarchicalMenu).length - 1]
    : [];

  return (
    <main id="maincontent">

      <Content layout="large">
        <Title element="h2" like="heading-3">
          Sorry! We were unable to find any results for
          {
            categoryHeirarchy.length > 0
              && <Filters>{` "${categoryHeirarchy.split('>').join(' + ')}"`}</Filters>
          }
          {
            facetFilters.length > 0
              && <Filters>{` "${facetFilters.map((f) => f.split(':')[1]).join(' + ')}"`}</Filters>
          }
          {
            searchState?.query?.length > 0
            && <Filters>{` "${searchState.query}"`}</Filters>
          }
          {
            trend
              && <Filters>{` "${trend}"`}</Filters>
          }
          {
            edit
              && <Filters>{` "${edit}"`}</Filters>
          }
        </Title>

        <NoResultsSubHeading element="p" like="dec-1">
            Check the spelling or try something less specific.
        </NoResultsSubHeading>

        <KeepShoppingButton

          onClick={(e) => {
            e.preventDefault();
            router.push('/shop');
          }}
          text="Keep Shopping"
          outline
          isLink
        />

      </Content>
    </main>
  );
};

ResultNone.defaultProps = {
  searchState: {},
  searchResults: {},
  edit: null,

  trend: null
};

ResultNone.propTypes = {
  searchResults: PropTypes.object,
  searchState: PropTypes.object,
  edit: PropTypes.string,
  trend: PropTypes.string
};

export default ResultNone;
