import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { connectStateResults } from 'react-instantsearch-dom';

// Context
import { useSearch } from '../../utils/context/search-provider';

// Hooks
import { useRecent } from '../../utils/context/recent-provider';
import { logAmplitude } from '../../utils/amplitude';

// Components
import Section from '../algolia-section';
import List, { ListItem } from '../algolia-list';

export const Tag = (props) => (
  <ListItem {...props}>
    <Link href={`/shop?w=${props.item.label}`}>
      <a>{props.children || props.item.label}</a>
    </Link>
  </ListItem>
);

Tag.defaultProps = {
  children: null
};

Tag.propTypes = {
  children: PropTypes.node,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired
};

const Tags = (props) => {
  const { items } = useRecent();
  const { searchState } = props;
  const { close, updateQuery } = useSearch();

  const handleClick = (params) => {
    logAmplitude('Used Recent Search Suggestion', params);
    updateQuery(params.term);
    close();
  };

  if (searchState.query) return null;

  return (
    <Section title="Recent Searches" {...props}>
      <List direction="row">
        { items.map((item) => (
          <Tag
            key={item.id}
            item={item}
            onClick={() => {
              const params = { term: item.label };
              handleClick(params);
            }}
          />
        ))}
      </List>
    </Section>
  );
};

Tags.propTypes = {
  searchState: PropTypes.object.isRequired
};

export default connectStateResults(Tags);
