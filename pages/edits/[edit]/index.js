import React from 'react';
import PropTypes from 'prop-types';

import PLPMeta from '../../../utils/meta';
import PLPPageHeader from '../../../organs/plp-page-header';
import { Page } from '../../../theme/page';

import withPLP, { withPLPServerSideProps } from '../../../organisms/products';
import PLPGrid from '../../../tissues/product-grid';
import Algolia from '../../../organisms/algolia-plp';

const Edit = (props) => {
  /**
   * get algolia value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const algolia = true;

  if (algolia) return <Algolia {...props} />;

  // `pageKey` is needed in order to trigger a re-render and state reset in all child
  // components when the URL changes as a consequence of modifying facets or sorting order.
  const pageKey = `${props.filters ? props.filters?.join(' ') : ''} ${props.sort}`;

  return (
    <Page id="maincontent" key={pageKey}>
      <PLPMeta {...props} />
      <PLPPageHeader {...props} />
      <PLPGrid {...props} />
    </Page>
  );
};

export const getServerSideProps = withPLPServerSideProps(null, 'edits');

Edit.propTypes = {
  filters: PropTypes.array.isRequired,
  sort: PropTypes.string.isRequired
};

export default withPLP(Edit);
