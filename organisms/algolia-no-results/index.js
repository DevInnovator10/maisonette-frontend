import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connectStateResults } from 'react-instantsearch-dom';

// Components
import { Title } from '../algolia-section';

const Container = styled.section(({ theme }) => ({
  alignItems: 'center',
  background: '#2B479814',
  color: theme.color.brand,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: '3rem',
  minHeight: '10rem',
  padding: '1rem',
  wordBreak: 'break-word',
  h3: {
    '::before': { content: '"\u2018"' },
    '::after': { content: '"\u2019"' }
  }
}));

const Label = styled(Title)(() => ({
  marginBottom: '0.5rem'
}));

const Term = styled(Title)(() => ({
  marginBottom: 0,
  textAlign: 'center',
  textTransform: 'unset'
}));

const NoResults = (props) => {
  const { searchResults, searchState } = props;
  const hasResults = searchResults?.nbHits !== 0;

  if (searchState.query && !hasResults) {
    return (
      <Container {...props}>
        <Label>WE COULDN&apos;T FIND ANY RESULTS FOR</Label>
        <Term as="h3">{props.searchState.query}</Term>
      </Container>
    );
  }

  return null;
};

NoResults.defaultProps = {
  searchResults: {}
};

NoResults.propTypes = {
  searchResults: PropTypes.object,
  searchState: PropTypes.object.isRequired
};

export default connectStateResults(NoResults);
