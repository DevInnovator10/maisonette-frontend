import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'emotion-theming';
import { InstantSearch } from 'react-instantsearch-dom';

import searchClient from './algolia.mock';
import GlobalTheme from '../../theme/theme';
import { SearchProvider } from '../context/search-provider';

const customRender = (node, ...options) => render(
  <ThemeProvider theme={GlobalTheme}>
    <InstantSearch
      searchClient={searchClient}
      indexName="jest"
    >
      <SearchProvider>
        { node }
      </SearchProvider>
    </InstantSearch>
  </ThemeProvider>,
  ...options
);

export * from '@testing-library/react';

export { customRender as render };
