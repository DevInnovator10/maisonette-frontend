import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Highlight, connectRefinementList } from 'react-instantsearch-dom';

import refinementMap from './utils/refinement-map.json';

import {
  List, Accordion, AccordionTrigger, AccordionPanel
} from './left-rail-shared';
import InputCheckbox from '../../atoms/checkbox';
import InputSearch from '../../atoms/input-search';
import PerfectScrollbarStyles from '../../theme/perfect-scrollbar';
import slugToSLI from '../../utils/slugToSLI';
import { logAmplitude } from '../../utils/amplitude';

const SearchRefinement = styled(InputSearch)`
  outline: 0;
  background-color: transparent;
  color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.white};
  margin-bottom: 2rem;
  ${(props) => props.theme.search(props.theme.color.white, '12px center', 12)}

  ::placeholder {
    color: ${(props) => props.theme.color.white};
    opacity: 0.7;
  }
  ::-moz-placeholder {
    color: ${(props) => props.theme.color.white};
    opacity: 0.7;
  }
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.color.white};
    opacity: 0.7;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
    border: 1px solid ${(props) => props.theme.color.brand};
    ${(props) => props.theme.search(props.theme.color.brand, '12px center', 12)}

    ::placeholder {
      color: ${(props) => props.theme.color.brand};
      opacity: 0.8;
    }
    ::-moz-placeholder {
      color: ${(props) => props.theme.color.brand};
      opacity: 0.8;
    }
    ::-webkit-input-placeholder {
      color: ${(props) => props.theme.color.brand};
      opacity: 0.8;
    }
  }
`;

const Checkbox = styled(InputCheckbox)(({ theme }) => ({
  color: theme.color.white,
  '&::before': { borderColor: theme.color.white },
  '&::after': { background: theme.color.white },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    color: theme.color.brand,
    '&::before': { borderColor: theme.color.brand },
    '&::after': { background: theme.color.brand }
  }
}));

const ListWrapper = styled.div`
  margin: 1rem 0 2rem 0;
  overflow: hidden;
  ${PerfectScrollbarStyles}
   li{
    label{
      text-align: left;
      margin-right: 1rem;
    }
   }
`;

const ShowAll = styled.span(({ theme }) => ({
  color: theme.color.brandLight,
  cursor: 'pointer',
  display: 'block',
  fontFamily: theme.font.sans,
  fontSize: '1.2rem',
  lineHeight: '18px',
  padding: '0.5rem 0 0.5rem 2.4rem',
  transition: `color ${theme.animation.default} ${theme.animation.easeOutQuad}`,
  ':hover': { color: theme.color.brand }
}));

const ShowMoreListItem = styled.li(({ showMore }) => ({
  display: showMore ? 'none' : undefined
}));

const NoResults = styled.section(({ theme }) => ({
  alignItems: 'center',
  background: '#2B479814',
  color: theme.color.brand,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1rem',
  fontFamily: theme.font.sans,
  fontSize: '1.2rem',
  lineHeight: '18px'
}));

const NoHyperlink = styled.button`
  border: none;
  background: none;
  padding: 0;
  // letter spacing to match global anchor tag style
  letter-spacing: 0.05rem;
`;

// switches between a button and a link to select filter for SEO purposes
// see ./utils/hyperlinkRules/index.js for details
const RefinementTrigger = ({ useHyperLink, children, ...props }) =>
  (useHyperLink ? <a {...props}>{children}</a> : <NoHyperlink {...props}>{children}</NoHyperlink>);

RefinementTrigger.defaultProps = {
  useHyperLink: false
};

RefinementTrigger.propTypes = {
  useHyperLink: PropTypes.bool,
  children: PropTypes.node.isRequired
};

const RefinementList = connectRefinementList(({
  attribute,
  createURL,
  isFromSearch,
  items,
  name,
  refine,
  searchable,
  searchForItems,
  showMore,
  toggleMore,
  useHyperlinks,
  itemsForHyperlinkCheck
}) => {
  const router = useRouter();
  const ref = useRef();
  const psRef = useRef();
  const [active, toggle] = useState(false);

  const onFacetClick = (e, item) => {
    e.preventDefault();

    const facets = router.query?.af?.replaceAll('+', ';');
    // TODO: eventually update this to no longer use slugToSLI()
    const navigationItem = `${refinementMap[attribute].id}:${slugToSLI(item.label.toLowerCase())}`;
    const selected = !item.isRefined;

    logAmplitude('Clicked Facet', {
      navigationItem,
      filterAction: 'Filter Applied',
      selected,
      facets
    });

    refine(item.value);
  };

  const onTriggerClick = () => {
    const facets = router.query?.af?.replaceAll('+', ';');
    const navigationItem = refinementMap[attribute].id;
    const selected = !active;

    logAmplitude('Clicked Facet', {
      navigationItem,
      filterAction: 'Filter Clicked',
      selected,
      facets
    });

    toggle(!active);
    setTimeout(() => toggleMore(false), 0);
  };

  useEffect(() => {
    const listener = (e) => {
      e.preventDefault();
      const { current: elem } = ref;
      // If the refinement item that was clicked was a hyperlink, it will be changed
      // to a button, so we need to search again for the element by the ID of the
      // original target inside of the original accordion to keep the accordion 'open'
      const accordion = global.document.getElementById(`${attribute}-accordion`);
      const target = global.document.getElementById(e.target.id);
      // this handles components that accept an ID.
      if (target && !accordion?.contains(target)) onTriggerClick();
      // Algolia components like Highlight do not accept an ID and need to be handled differently.
      else if (!elem.contains(e.target)) onTriggerClick();
    };

    if (active) global.document.addEventListener('click', listener);
    else global.document.removeEventListener('click', listener);

    return () => global.document.removeEventListener('click', listener);
  }, [active, useHyperlinks, itemsForHyperlinkCheck]);

  useEffect(() => {
    if (psRef.current) psRef.current.updateScroll();
  }, [psRef]);

  return (
    <Accordion id={`${attribute}-accordion`} ref={ref}>
      <AccordionTrigger
        isOpened={active}
        aria-expanded={active}
        onClick={onTriggerClick}
      >
        {refinementMap[attribute].label}
      </AccordionTrigger>

      <AccordionPanel active={active}>
        {
          searchable && (
            <SearchRefinement
              id={`${attribute}.search-input`}
              type="input"
              placeholder={`Search for a ${name || attribute}...`}
              onChange={(event) => searchForItems(event.currentTarget.value)}
            />
          )
        }

        <ListWrapper>
          {
            items.length > 0 ? (
              <List component="ul" ref={psRef} showMore={showMore} className="ps">
                {
                  items.map((item) => {
                    const renderAsHyperlink = useHyperlinks
                      || itemsForHyperlinkCheck?.[item?.value?.[0]]
                      //! an edge case. please see TEC-6317
                      || (item.isRefined && itemsForHyperlinkCheck?.[item?.label]);

                    return (
                      <li key={item.label}>
                        <RefinementTrigger
                          useHyperLink={renderAsHyperlink}
                          aria-label={`${item.isRefined ? 'remove' : 'add'} filter, ${refinementMap[attribute].label} ${item.label}`}
                          href={renderAsHyperlink ? createURL(item.value) : undefined}
                          onClick={(e) => onFacetClick(e, item)}
                        >
                          <Checkbox
                            labelID={`${attribute}.${item.label}.label`}
                            id={`${attribute}.${item.label}`}
                            name={item.label}
                            value={item.label}
                            active={item.isRefined}
                          >
                            {
                              isFromSearch
                                ? <Highlight attribute="label" tagName="mark" hit={item} />
                                : item.label
                            }
                            {` (${item.count})`}
                          </Checkbox>
                        </RefinementTrigger>
                      </li>
                    );
                  })
                }

                {
                  items.length >= 10 && (
                    <ShowMoreListItem showMore={showMore}>
                      <ShowAll id={`${attribute}.show-all`} onClick={() => toggleMore(true)}>Show All...</ShowAll>
                    </ShowMoreListItem>
                  )
                }
              </List>
            ) : (
              <List component="div">
                <NoResults id={`${attribute}.no-results`}>No Results</NoResults>
              </List>
            )
          }
        </ListWrapper>
      </AccordionPanel>
    </Accordion>
  );
});

const Refinement = (props) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <RefinementList
      {...props}
      showMoreLimit={9999}
      showMore={showMore}
      toggleMore={setShowMore}
    />
  );
};

export default Refinement;
