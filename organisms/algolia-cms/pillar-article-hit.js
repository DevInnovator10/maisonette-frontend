/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// utils
import Link from '../../utils/link';
import { trackModuleClick } from '../../theme/page';
import Picture from '../../atoms/picture';

import { useSearch } from '../../utils/context/search-provider';
import Typography from '../../atoms/typography';
import formatCatSubcatFromHM from './utils/formatCatSubcatFromHM/index';

// Helpers
const getImagePath = (payload) => {
    try {
    const [imageName, extension] = payload.imageName.split('.');
    return payload.raw
        ? `${process.env.NEXT_PUBLIC_ASSET_HOST}/${payload.uri}${imageName}.${extension}`
      : `${process.env.NEXT_PUBLIC_ASSET_HOST}/${payload.uri}${imageName}-small.${extension}`;
  } catch (error) {
    return null;
  }
};

const getSubcategory = (hit) => {
  if (!hit) return null;
  const { categories_slug } = hit;
  if (categories_slug?.lvl1) {
    const hm = categories_slug.lvl1;
    const { subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu: hm[0] });
    return subcategoryData?.displayName;
  }
  return null;
};

const PillarStoryCard = styled.a`
  display: flex;
  flex-direction: column;
  text-decoration: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin: 0;
    width: auto;
  }
`;

const PillarStoryTag = styled(Typography)`
  text-transform: uppercase;
  margin-bottom:${({ theme }) => theme.modularScale.eight};
`;

const PillarStoryTitle = styled.h3`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: ${({ theme }) => theme.modularScale.eighteen};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    font-size: ${({ theme }) => theme.modularScale.thirtyTwo};
  }
`;

const ImageFallback = styled.img`
  border: 1px solid #F4F4F4;
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.modularScale.thirty};
  object-fit: cover;
  margin-right: 0;

  @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-right: 5%;
  }
`;

const Story = styled.article`
  height: 100%;
  grid-column: span 1;
  margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-column: span 2;

    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(6),
    &:nth-of-type(7) {
      grid-column: span 3;
      a {
        flex-direction: row;

        div {
          flex: 0 0 45%;
        }
      }
  
      picture, ${ImageFallback} {
        flex: 1 1 50%;
        margin: 0 ${({ theme }) => theme.modularScale.thirtyTwo} 0 0;
      }
    }
  }

  &:nth-of-type(3),
  &:nth-of-type(4) {
    @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
      margin-bottom: 0;
    }
  }

  &:nth-of-type(3),
  &:nth-of-type(4),
  &:nth-of-type(5) {
    grid-column: span 2;
    @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
      a {
        flex-direction: row;
      }
      picture, ${ImageFallback} {
        width: 30%;
        min-width: 80px;
        margin-right: 5%;
        margin-bottom: 0;
      }
    }
  }

  &:nth-of-type(10) {
    grid-column: span 2;
  }
`;

const StoryImage = styled(Picture)`
  width: 100%;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};

  img {
    border-radius: 4px;
  }
`;

const ArticleHit = ({
  hit, removeLoadingState, idx, hitPageNumber, pageSlug
}) => {
  const {
    updateScrollPage,
    updateScrollSlug
  } = useSearch();

  const handleOnLoad = () => {
    if (idx === 0) removeLoadingState(hitPageNumber);
  };

  return (
    <Story
      key={`story-${hit.objectID}`}
      data-article-slug={`${hit.objectID}`}
      onClick={(e) => {
        const [path, queryParams] = pageSlug.split('?');
        const searchParams = new global.URLSearchParams(queryParams);
        if (searchParams.get('page') === '1') { searchParams.delete('page'); }

        const newQueryParams = searchParams.toString();
        const newPageSlug = newQueryParams === '' ? path : `${path}?${newQueryParams}`;

        // to store product & page slug for scroll restoration
        updateScrollPage(newPageSlug);
        updateScrollSlug(hit.objectID);
        // eslint-disable-next-line no-underscore-dangle
        trackModuleClick(e, { title: 'story' }, hit.__position);
      }}
    >
      <Link href={hit.url} passHref>
        <PillarStoryCard>
          {
            hit.image ? (
              <StoryImage
                onLoad={handleOnLoad}
                alt={hit.title}
                src={getImagePath(hit.image) ?? '/images/default.png'}
                size="small"
                {...hit.image}
              />
            ) : (
              <ImageFallback
                onLoad={handleOnLoad}
                onError={handleOnLoad}
                alt={hit.title}
                src={getImagePath(hit.image) ?? '/images/default.png'}
              />
            )
        }
          <div>
            {
              getSubcategory(hit) && (
                <PillarStoryTag element="p" like="paragraph-5">
                  {getSubcategory(hit)}
                </PillarStoryTag>
              )
            }
            <PillarStoryTitle>
              {hit.title}
            </PillarStoryTitle>
          </div>
        </PillarStoryCard>
      </Link>
    </Story>
  );
};

ArticleHit.defaultProps = {
  idx: 0,
  hitPageNumber: 0,
  removeLoadingState: () => {},
  pageSlug: '0'
};

ArticleHit.propTypes = {
  hit: PropTypes.object.isRequired,
  idx: PropTypes.number,
  hitPageNumber: PropTypes.number,
  removeLoadingState: PropTypes.func,
  pageSlug: PropTypes.string
};

export default ArticleHit;
