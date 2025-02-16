import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connectSearchBox, connectStateResults } from 'react-instantsearch-dom';
import { connect } from 'react-redux';

// Hooks
import { useRouter } from 'next/dist/client/router';
import { useRecent } from '../../utils/context/recent-provider';
import { useSearch } from '../../utils/context/search-provider';
import { toggleGlobalSearchVisibility } from '../../store/modules/interfaces/actions';

// Components
import Input from '../../atoms/input-search';
import Icon from '../../atoms/icon-circle-arrow';
import Button from '../../atoms/button';
import IconCross from '../../atoms/icon-cross';

import isMobile from '../../utils/isMobile';

import { logAmplitude, handleSplitTests } from '../../utils/amplitude';
import { getAlgoliaABTests } from '../../utils/amplitudeHelpers/splitTestHelpers/index';

// Assets
const SearchSVG = (props) => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13.9962 13.9619L9.91407 9.80773C10.8875 8.72751 11.427 7.3318 11.4305 5.88464C11.4562 4.35607 10.8698 2.87949 9.79927 1.77705C8.72873 0.67461 7.26094 0.0358009 5.71613 0C4.17116 0.0355546 2.70312 0.674255 1.63238 1.77672C0.561632 2.87919 -0.024888 4.35591 0.000810212 5.88464C-0.024888 7.41336 0.561632 8.89009 1.63238 9.99255C2.70312 11.095 4.17116 11.7337 5.71613 11.7693C6.83317 11.7644 7.92555 11.444 8.86483 10.8458L12.9469 15L14 13.9581L13.9962 13.9619ZM5.71518 10.268C4.55927 10.2389 3.46059 9.76418 2.65345 8.94504C1.8463 8.1259 1.39456 7.02719 1.39456 5.88322C1.39456 4.73924 1.8463 3.64053 2.65345 2.82139C3.46059 2.00225 4.55927 1.5275 5.71518 1.49839C6.87262 1.52127 7.9744 1.99415 8.78209 2.81469C9.58977 3.63522 10.0384 4.73742 10.0309 5.88274C10.0445 6.45261 9.94308 7.01944 9.73257 7.55005C9.52206 8.08066 9.20668 8.5644 8.80488 8.97294C8.40309 9.38148 7.92296 9.70662 7.39259 9.92933C6.86223 10.152 6.29229 10.2678 5.71613 10.2699L5.71518 10.268Z" fill="#3150A2" />
  </svg>
);

const SearchIcon = styled(SearchSVG)(() => {
  const height = 15;

  return {
    position: 'absolute',
    height,
    width: height,
    left: '1.5rem',
    top: 20 - height / 2 // 20 === height of input
  };
});

const ArrowIcon = styled(Icon)(({ theme }) => ({
  cursor: 'pointer',
  display: 'none',
  height: '2rem !important',
  width: '2rem !important',
  fill: theme.color.white,
  stroke: theme.color.brand,
  strokeWidth: '5px',
  position: 'absolute',
  right: '1.5rem',
  top: '1rem',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    fill: theme.color.brand,
    stroke: theme.color.white
  }
}));

const Cancel = styled(Button)(({ theme }) => ({
  border: 0,
  borderRadius: 0,
  display: 'none',
  fontFamily: theme.font.sans,
  height: '4rem',
  letterSpacing: 'initial',
  position: 'absolute',
  right: 0,
  textTransform: 'initial',
  top: 0,
  width: '4rem',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
  }
}));

const SearchInput = styled(Input)(({ theme }) => ({
  color: theme.color.brand,
  border: '1px solid #D3D3D3',
  marginBottom: 0,
  padding: '0 0 0 4rem',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    border: 'none',
    ':focus': { border: 'none' },
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    borderRadius: '32px'
  },
  '::placeholder': { color: theme.color.brandLightBlue },
  // remove 'x' from IE
  '::-ms-clear': { display: 'none', width: 0, height: 0 },
  '::-ms-reveal': { display: 'none', width: 0, height: 0 },
  // remove 'x' from Chrome
  '::-webkit-search-decoration, ::-webkit-search-cancel-button, ::-webkit-search-results-button,::-webkit-search-results-decoration': { display: 'none' }
}));

const Form = styled.form(({ isOpened, theme, currentRefinement }) => ({
  position: 'relative',
  ...(
    isOpened && ({
      [Cancel]: { display: 'block' },
      [SearchIcon]: { left: 0 },
      [SearchInput]: {
        borderColor: '#ffffff',
        borderBottom: '1px solid #D3D3D3',
        marginBottom: theme.modularScale.xlarge,
        // 15 (width of icon) + 1rem (10)
        padding: '0 0 0 25px',
        ':focus': { borderBottomColor: '#8E9FCC' }
      },
      [`@media screen and (min-width: ${theme.breakpoint.small})`]: {
        [SearchIcon]: { left: '1.5rem' },
        [Cancel]: { display: 'none' },
        [SearchInput]: {
          borderColor: '#ffffff',
          boxShadow: 'rgb(0 0 0 / 16%) 0px 3px 30px',
          marginBottom: 0,
          padding: '0 0 0 4rem',
          ':focus': { borderColor: '#ffffff' }
        },
        ...(
          currentRefinement.length && ({
            [ArrowIcon]: {
              display: 'block'
            }
          })
        )
      },
      [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
        top: '8px',
        paddingRight: '56px',
        [ArrowIcon]: {
          right: '64px'
        },
        [SearchInput]: {
          border: 'none',
          ':focus': { border: 'none' },
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        },
        [Cancel]: {
          ':hover': { opacity: 1 },
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          display: 'block',
          background: '#ffffff',
          borderRadius: '100%',
          padding: '2px 14px',
          svg: {
            strokeWidth: 10,
            stroke: theme.color.brand
          }
        }
      }
    })
  )
}));

let EVENT_TIMEOUT = null;

const SearchBox = (props) => {
  const { currentRefinement, refine, searchResults } = props;
  const { addItem } = useRecent();
  const {
    state: { isOpened, query }, open, close
  } = useSearch();

  const router = useRouter();
  const abTests = getAlgoliaABTests(searchResults);

  useEffect(() => {
    if (isOpened && !isMobile()) {
      global.document.body.style.overflowY = 'hidden';
    } else {
      global.document.body.style.overflowY = 'auto';
    }
  }, [isOpened]);

  const handleOnCancel = () => {
    props.toggleGlobalSearchVisibility(false);
    logAmplitude('Closed Search');
    close();
  };

  useEffect(() => {
    // set Algolia AB tests for current user
    // this property is set via setUser and resetUser
    // from utils/amplitude.js when a user logs in/out
    handleSplitTests({ newSplitTests: abTests });
  }, [abTests]);

  useEffect(() => {
    // log amplitude on search term and latest algolia hits

    if (currentRefinement && isOpened) {
      clearTimeout(EVENT_TIMEOUT);

      EVENT_TIMEOUT = setTimeout(() => {
        logAmplitude('Viewed Search Results', {
          totalChars: currentRefinement.length,
          query: currentRefinement,
          totalResults: searchResults.nbHits
        });
      }, 1000);
    }
  }, [searchResults?.nbHits]);

  const handleOnChange = (e) => {
    if (!isOpened) open();
    const { value } = e.currentTarget;
    refine(value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    addItem(currentRefinement);
    close();

    if (currentRefinement.length) {
      router.push(`/shop?w=${encodeURIComponent(currentRefinement).replace(/%20/g, '+')}`);
    }
  };

  const handleOnFocus = (e) => {
    if (e.currentTarget === e.target) {
      e.target.select();
      open(true);
    }
  };

  useEffect(() => {
    refine(query);
  }, [query]);

  return (
    <Form
      noValidate
      role="search"
      onSubmit={handleOnSubmit}
      isOpened={isOpened}
      {...props}
    >
      <label htmlFor="algolia-search">
        <SearchIcon />
      </label>

      <SearchInput
        id="algolia-search"
        autoComplete="off"
        name="w"
        onChange={handleOnChange}
        onClick={handleOnFocus}
        onFocus={handleOnFocus}
        placeholder="Search for anything"
        type="search"
        value={currentRefinement}
      />

      <ArrowIcon
        onClick={() => {
          if (currentRefinement.length) {
            close();
            addItem(currentRefinement);
            router.push(`/shop?w=${currentRefinement}`);
          }
        }}
      />

      <Cancel
        isText
        onClick={handleOnCancel}
      >
        {isMobile() ? 'Cancel' : <IconCross />}
      </Cancel>
    </Form>
  );
};

SearchBox.defaultProps = {
  searchResults: {},
  user: {}
};

SearchBox.propTypes = {
  searchResults: PropTypes.object,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
  isGlobalSearchActive: PropTypes.bool.isRequired,
  toggleGlobalSearchVisibility: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isGlobalSearchActive: state.interfaces.isGlobalSearchActive,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  toggleGlobalSearchVisibility: (isActive) => dispatch(toggleGlobalSearchVisibility(isActive))
});

// eslint-disable-next-line max-len, no-spaced-func
export default connect(mapStateToProps, mapDispatchToProps)(connectSearchBox(connectStateResults(SearchBox)));
