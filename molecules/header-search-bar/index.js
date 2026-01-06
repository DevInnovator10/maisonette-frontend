import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router from 'next/router';

// Components
import Input from '../../atoms/input-search';
import SearchSuggestions from '../../tissues/search-global-suggestion/search';
import Button from '../../atoms/button';

// Tracking
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';

// Assets
import SearchSVG from '../../atoms/icon-search';
import Icon from '../../atoms/icon-circle-arrow';

// Redux
import withSearchActions from '../../organisms/search';

const Wrapper = styled.div((props) => ({
  padding: props.hasResultsModal ? '1.5rem 0' : '0 2rem 1rem 2rem',
  width: '100%',
  position: props.hasResultsModal ? 'fixed' : 'relative',
  ...(props.hasResultsModal && {
    background: 'white',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: props.theme.layers.box
  }),
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    background: 'inherit',
    bottom: 0,
    padding: '0 2rem 1rem 2rem',
    position: 'relative'
  }
}));

const InnerWrapper = styled.form((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: props.hasResultsModal && '100%',
  margin: '0 auto',
  maxWidth: props.theme.width.medium,
  position: 'relative',
  transition: `transform ${props.theme.animation.default} ${props.theme.animation.easeOutQuart}`,
  transform: props.isNavigationActive && 'translate3d(28rem, 0, 0)',
  zIndex: props.isNavigationActive ? -1 : 1,
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    display: 'block'
  }
}));

const SearchWrapper = styled.span((props) => (props.hasResultsModal ? ({
  position: 'relative',
  '::after': {
    content: '" "',
    display: 'block',
    height: 1,
    width: 'calc(100% - 4rem)',
    margin: '0 auto',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    position: 'initial'
  }
}) : null));

const Cancel = styled(Button)((props) => (props.hasResultsModal ? ({
  position: 'absolute',
  right: '2rem',
  height: '4rem',
  border: 0,
  textTransform: 'initial',
  letterSpacing: 'initial',
  bottom: 0,
  fontSize: 14,
  fontFamily: props.theme.font.sans,
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    display: 'none'
  }
}) : { display: 'none' }));

const Search = styled(Input)((props) => ({
  border: !props.hasResultsModal && '0.5px solid #D3D3D3',
  color: props.theme.color.brand,
  fontSize: 14,
  padding: '1rem 2rem 1rem 5rem',
  transition: `border-color ${props.theme.animation.fast} ease-in-out`,
  '::placeholder': { color: '#A2A2A2' },
  ':focus': { borderColor: '#8E9FCC' },
  // remove 'x' from IE
  '::-ms-clear': { display: 'none', width: 0, height: 0 },
  '::-ms-reveal': { display: 'none', width: 0, height: 0 },
  // remove 'x' from Chrome
  '::-webkit-search-decoration, ::-webkit-search-cancel-button, ::-webkit-search-results-button,::-webkit-search-results-decoration': { display: 'none' },
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    boxShadow: props.hasResultsModal && '0px 3px 30px #00000029'
  }
}));

const StyledSearch = styled(Search)`
  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    :focus {
      font-size: 16px;
    }
  }
`;

const SearchIcon = styled(SearchSVG)((props) => ({
  fill: props.theme.color.brand,
  height: '4rem',
  position: 'absolute',
  left: '1.5rem',
  width: '2.5rem',
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    left: '2rem'
  }
}));

const IconCircleArrow = styled(Icon)((props) => ({
  display: 'none',
  [`@media screen and (min-width: ${props.theme.breakpoint.small})`]: {
    cursor: 'pointer',
    display: props.hasResultsModal && 'block',
    height: '2rem !important',
    width: '2rem !important',
    fill: props.theme.color.white,
    stroke: props.theme.color.brand,
    strokeWidth: '5px',
    position: 'absolute',
    right: '1.5rem',
    top: '1rem'
  }
}));

const trackSearchOpened = () => {
  trackEvent({
    event: 'techEvent',
    eventCategory: 'Search',
    eventAction: 'Open Search Box'
  });

  logAmplitude('Opened Search');
};

const SearchBar = (props) => {
  const [focused, setFocused] = useState(false);

  const handleOnChange = (event) => {
    const { target } = event;
    const term = target.value;

    props.updateSearchTerm(term);
    props.updateSearchResultsCount(0);
  };

  const handleOnFocus = (e) => {
    if (e.currentTarget === e.target) {
      setFocused(true);
      if (!focused) trackSearchOpened();
    }
  };

  const handleOnBlur = (e) => setFocused(e.currentTarget !== e.target);

  const handleOnClose = () => props.toggleGlobalSearchVisibility(false);

  const handleOnFormSubmit = (e) => {
    e.preventDefault();

    if (props.globalSearchTerm.trim()) {
      Router.push(`/shop?w=${props.globalSearchTerm}`);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (props.globalSearchTerm.trim()) {
        Router.push(`/shop?w=${props.globalSearchTerm}`);
      }
      handleOnClose();
    }
  };

  useEffect(() => {
    // show search suggestions if term !== ''
    props.toggleGlobalSearchVisibility(props.globalSearchTerm.length > 0);
  }, [props.globalSearchTerm]);

  useEffect(() => {
    // reset search term when visibility changes from visible to not visible
    if (!props.isGlobalSearchActive) props.updateSearchTerm('');
  }, [props.isGlobalSearchActive]);

  return (
    <Wrapper hasResultsModal={props.isGlobalSearchActive}>
      <InnerWrapper
        hasResultsModal={props.isGlobalSearchActive}
        isNavigationActive={props.isNavigationActive}
        onSubmit={handleOnFormSubmit}
      >
        <SearchWrapper hasResultsModal={props.isGlobalSearchActive} inputFocused={focused}>
          <StyledSearch
            id="global-search"
            name="w"
            placeholder="Search for anything"
            type="search"
            value={props.globalSearchTerm}
            hasResultsModal={props.isGlobalSearchActive}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyDown={handleOnKeyDown}
            {...props}
          />

          <SearchIcon />
          <IconCircleArrow
            hasResultsModal={props.isGlobalSearchActive}
            onClick={() => Router.push(`/shop?w=${props.globalSearchTerm.trim()}`)}
          />

          <Cancel
            text="Cancel"
            hasResultsModal={props.isGlobalSearchActive}
            isText
            onClick={handleOnClose}
          />
        </SearchWrapper>

        <SearchSuggestions onClose={handleOnClose} />
      </InnerWrapper>
    </Wrapper>
  );
};

SearchBar.defaultProps = {
  globalSearchTerm: ''
};

SearchBar.propTypes = {
  isGlobalSearchActive: PropTypes.bool.isRequired,
  isNavigationActive: PropTypes.bool.isRequired,
  globalSearchTerm: PropTypes.string,
  updateSearchTerm: PropTypes.func.isRequired,
  updateSearchResultsCount: PropTypes.func.isRequired,
  toggleGlobalSearchVisibility: PropTypes.func.isRequired
};

export default withSearchActions(SearchBar);
