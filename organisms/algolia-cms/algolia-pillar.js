import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import { Page } from '../../theme/page';
import LeScoopMeta from './le_scoop-meta';
import LeScoopHeader from './le_scoop-logo-header';
import PageModules from './page-modules';
import ArticleResults from './algolia-articles';

import { logAmplitude } from '../../utils/amplitude';

const AlgoliaPillar = (props) => {
    const router = useRouter() ?? {};
  const isLeScoopIndex = props.type === 'homepage' && props.page.URL === '/le_scoop';
  const isLeScoopIndexPreview = props.type === 'preview' && props.page.URL === '/le_scoop';
  const showLeScoopHeader = isLeScoopIndex || isLeScoopIndexPreview;

  useEffect(() => {
    logAmplitude(null, {
      category: props.category?.displayName,
      subcategory: props.subcategory?.displayName,
      parentPage: props.parentPage
    });
  }, [router.asPath]);

  return (
    <Page background={props.page.Background} id="maincontent">
      <LeScoopMeta {...props} />
      { showLeScoopHeader && <LeScoopHeader />}
      <PageModules
        page={props.page}
        modules={props.modules}
        category={props.category}
        subcategory={props.subcategory}
      />

      <ArticleResults {...props} />

    </Page>
  );
};

AlgoliaPillar.defaultProps = {
  createURL: () => {},
  category: null,
  subcategory: null,
  featuredStoriesIds: [],
  parentPage: null
};

AlgoliaPillar.propTypes = {
  searchClient: PropTypes.object.isRequired,
  resultsState: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  createURL: PropTypes.func,
  indexName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  page: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  featuredStoriesIds: PropTypes.array,
  category: PropTypes.object,
  subcategory: PropTypes.object,
  parentPage: PropTypes.string
};

export default AlgoliaPillar;
