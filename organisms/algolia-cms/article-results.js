import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withRouter } from 'next/router';
import { connectInfiniteHits, connectStateResults } from 'react-instantsearch-dom';
import { InView } from 'react-intersection-observer';

import Link from 'next/link';
import ArticleHit from './pillar-article-hit';
import Button from '../../atoms/button';

import { useSearch } from '../../utils/context/search-provider';

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
`;

const ResultsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  grid-gap: 2rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-rows: repeat(3, min-content);
  }
`;

const GridButtonAnchor = styled.a`
  width: 100%;
  text-decoration: none;
  text-align: center;
`;

const GridButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  width: 'fit-content',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    width: '33%',
    margin: '0 auto'
  }
}));

const GridSentinel = styled(InView)``;

const PageSentinel = styled(InView)`
  display: grid;
  grid-gap: 3.2rem;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const Loading = styled.span(({ theme }) => ({
  display: 'block',
  gridArea: 'loader',
  height: '6rem',
  position: 'relative',
  width: '100%',
  '::after': {
    animation: 'spin .5s infinite linear',
    border: `0.25rem solid ${theme.color.brand}`,
    borderRadius: 290486,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    content: '""',
    height: '3rem',
    left: 'calc(50% - (3rem / 2))',
    position: 'absolute',
    top: 'calc(50% - (3rem / 2))',
    width: '3rem'
  }
}));

const InfiniteHitsArticlesResults = (props) => {
  const {
    state: {
      scrollPage,
      scrollSlug
    },
    resetScrollPage,
    resetScrollSlug
  } = useSearch();

  const [viewNext, setViewNext] = useState(false);
  const [viewPrev, setViewPrev] = useState(false);
  const [minPageNum, setMinPageNum] = useState(props.currentPage);
  const [maxPageNum, setMaxPageNum] = useState(props.currentPage);
  const [displayPreviousLoading, setDisplayPreviousLoading] = useState(false);

  const groupHitsByPage = () => props.hits.reduce((pagesArray, hit, idx) => {
    if (idx % props.hitsPerPage === 0) {
      pagesArray.push([hit]);
    } else {
      pagesArray[pagesArray.length - 1].push(hit);
    }

    return pagesArray;
  }, []);

  const generatePageNumber = (index) => minPageNum + index;

  const finishedLoadingPrevResults = (pageNum) => {
    // to handle the loading spinner for cached results,
    // we can check if scrollPage is truthy value.
    // if it is, that means the user has visited this page before
    if ((scrollPage && scrollPage.length)
    && (pageNum === minPageNum)
    && displayPreviousLoading) {
      setDisplayPreviousLoading(false);
    }
  };

  const onNextSentinelIntersection = (inView, entry) => {
    const { hasMore, refineNext } = props;

    if (entry.isIntersecting && hasMore && viewNext) {
      setMaxPageNum(maxPageNum + 1);
      refineNext();
    }
  };

  const onPageSentinelIntersection = (inView, entry) => {
    if (inView) {
      const { asPath } = props.router;
      const [path, queryParams] = asPath.split('?');
      const searchParams = new global.URLSearchParams(queryParams);
      const currentPageOnURL = searchParams.get('page');
      const currentPageInView = parseInt(entry.target.dataset.scrollingpagenum, 10);

      if (parseInt(currentPageOnURL, 10) !== currentPageInView) {
        searchParams.set('page', entry.target.dataset.scrollingpagenum);

        if (currentPageInView === 1) {
          searchParams.delete('page');
        }
        const newQueryParams = searchParams.toString();
        const url = newQueryParams === '' ? path : `${path}?${newQueryParams}`;
        props.router.push(url, undefined, { shallow: true });
      }
    }
  };

  const getUrlPath = (direction) => {
    const { asPath } = props.router;
    const [path, queryParams] = asPath.split('?');
    const searchParams = new global.URLSearchParams(queryParams);

    let newPage;

    if (typeof direction === 'number') {
      newPage = direction;
    } else {
      newPage = direction === 'prev' ? minPageNum - 1 : maxPageNum + 1;
    }

    searchParams.set('page', newPage);
    const newQueryParams = searchParams.toString();
    return `${path}?${newQueryParams}`;
  };

  const scrollToLastArticleClicked = () => {
    if (scrollPage && scrollPage === props.router.asPath && scrollSlug.length) {
      const elem = global.document.querySelector(`[data-article-slug="${scrollSlug}"]`);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ block: 'center' });
        }, 0);
      }
    }
  };

  useEffect(() => {
    scrollToLastArticleClicked();
  }, []);

  useEffect(() => {
    // to handle loading state if no cached results.
    // if scrollPage is falsy, then this is the first

    // time the user has visited this page
    if (!scrollPage && !props.isSearchStalled && viewPrev) {
      setDisplayPreviousLoading(false);
      setViewPrev(false);
    }
  }, [props.isSearchStalled]);

  useEffect(() => {
    // this is a waterfall effect for the loading wheel
    // and the Prev Button.
    // if both displayPreviousLoading & viewPrev were
    // set to false at the same time,
    // then the user would not be able to see the loading wheel
    if (!displayPreviousLoading && viewPrev) {
      setViewPrev(false);
    }
  }, [displayPreviousLoading]);

  useEffect(() => {
    if (props.router && props.router.asPath) {
      const { asPath } = props.router;
      const queryParams = asPath.split('?')[1];
      const searchParams = new global.URLSearchParams(queryParams);
      const currentPageOnURL = parseInt(searchParams.get('page'), 10);

      // // we need this conditional because
      // // isSearchStalled does not return false
      // // when the user scrolls back up to page 1
      if (currentPageOnURL === 1
        && !props.isSearchStalled
        && !props.hasPrevious
        && viewPrev && displayPreviousLoading
      ) {
        setViewPrev(false);
        setDisplayPreviousLoading(false);
      }
    }
  }, [props.router]);

  useEffect(() => {
    // to reset all local state if page is changed
    if (props.currentPage === 1) {
      resetScrollPage();
      resetScrollSlug();
      setMinPageNum(props.currentPage);
      setMaxPageNum(props.currentPage);
      setViewNext(false);
      setViewPrev(false);
      setDisplayPreviousLoading(false);
    }
  }, [props.currentPage]);

  return (
    <GridWrapper>
      {
        props.hasPrevious && !viewPrev && (
          <Link href={getUrlPath('prev')} passHref>
            <GridButtonAnchor onClick={(e) => e.preventDefault()}>
              <GridButton
                type="button"
                onClick={() => {
                  if (!viewPrev) {
                    setMinPageNum(minPageNum - 1);
                    props.refinePrevious();
                    setDisplayPreviousLoading(true);
                    setViewPrev(true);
                  }
                }}
              >
                  Load Previous
              </GridButton>
            </GridButtonAnchor>
          </Link>
        )
      }

      { displayPreviousLoading && <Loading />}

      <ResultsWrapper>
        {
          groupHitsByPage().map((page, i) => (
            <PageSentinel
              key={`page-${generatePageNumber(i)}`}
              data-scrollingpagenum={generatePageNumber(i)}
              threshold={0}
              onChange={onPageSentinelIntersection}
            >
              {
                page.map((hit, idx) => (
                  <ArticleHit
                    idx={idx}
                    key={hit.objectID}
                    hit={hit}
                    pageSlug={getUrlPath(generatePageNumber(i))}
                    hitPageNumber={generatePageNumber(i)}
                    removeLoadingState={finishedLoadingPrevResults}
                  />
                ))
                }
            </PageSentinel>
          ))
        }

        { viewNext && props.hasMore && (
          <GridSentinel threshold={0} onChange={onNextSentinelIntersection}>
            <Loading />
          </GridSentinel>
        )}
      </ResultsWrapper>
      {
        props.hasMore && !viewNext && (
          <Link href={getUrlPath('next')} passHref>
            <GridButtonAnchor onClick={(e) => e.preventDefault()}>
              <GridButton
                type="button"
                onClick={() => {
                  if (!viewNext) {
                    props.refineNext();
                    setViewNext(true);
                  }
                }}
              >
                  Load More
              </GridButton>
            </GridButtonAnchor>
          </Link>
        )
      }
    </GridWrapper>
  );
};

InfiniteHitsArticlesResults.defaultProps = {
  currentPage: 1,
  hitsPerPage: 9,
  isSearchStalled: false
};

InfiniteHitsArticlesResults.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number,
  hasPrevious: PropTypes.bool.isRequired,
  refinePrevious: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  isSearchStalled: PropTypes.bool
};

const ConnectedInfiniteHitsArticlesResults = withRouter(
  connectInfiniteHits(InfiniteHitsArticlesResults)
);

const InfiniteHitsArticles = connectStateResults((props) => {
  const pageNo = props.searchResults?.page;
  const hitsPP = props.searchResults?.hitsPerPage;

  return (
    <ConnectedInfiniteHitsArticlesResults
      currentPage={pageNo ? +pageNo + 1 : 1}
      hitsPerPage={hitsPP}
      isSearchStalled={props.isSearchStalled}
    />
  );
});

export default InfiniteHitsArticles;
