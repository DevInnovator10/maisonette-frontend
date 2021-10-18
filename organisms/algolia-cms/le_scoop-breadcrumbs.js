import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from '../../utils/link';
import { Content } from '../../theme/page';

import Typography from '../../atoms/typography';

const StyledContent = styled(Content, { shouldForwardProp: (prop) => prop !== 'isStory' })`
  // a hero has a negative margin on mobile
  // this removes the bottom padding for breadcrumbs of non story
  // pages to keep the breadcrumb layout from touching the hero
  ${({ isStory }) => !isStory && 'padding-bottom: 0;'}
`;

const BreadcrumbList = styled.ol`
  display: flex;
  justify-content: start;
  flex-direction: row;
  flex-wrap: wrap;
  color: ${(props) => props.theme.color.brand};
`;

const Breadcrumb = styled(Typography)`
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  letter-spacing: 0.05rem;
  font-size: ${({ theme }) => theme.modularScale.fourteen};

  @media screen and (min-width: ${(({ theme }) => theme.breakpoint.medium)}) {
    font-size: ${({ theme }) => theme.modularScale.sixteen};
  }
`;

const BreadcrumbItem = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.modularScale.thirteen};

  &:not(:last-of-type) {
    &:after {
      content: "";
      position: relative;
      display: inline-block;
      border:  1px solid ${({ theme }) => theme.color.brand};
      border-width: 0 1px 1px 0;
      padding: 2px;
      transform: rotate(315deg);
      margin: 0 1rem;
    }
  }
`;

const renderBreadcrumbItem = (path, pillarHref, displayName) => {
  // for SEO purposes, the breadcrumb for the current page should not be a link
  if (path === pillarHref) {
    return (
      <BreadcrumbItem element="li" like="dec-1">
        <Breadcrumb element="p" like="dec-1">{displayName}</Breadcrumb>
      </BreadcrumbItem>
    );
  }

  return (
    <BreadcrumbItem element="li" like="dec-1">
      <Link passHref href={pillarHref}>
        <Breadcrumb element="a" like="dec-1">{displayName}</Breadcrumb>
      </Link>
    </BreadcrumbItem>
  );
};

const LeScoopBreadCrumbs = ({
  category, subcategory, path, isStory
}) => {
  const catHref = () => `/le_scoop/${category.slug}`;
  const subcatHref = () => `/le_scoop/${category.slug}/${subcategory.slug}`;

  return (
    category && (
      <StyledContent isStory={isStory}>
        <BreadcrumbList>
          <BreadcrumbItem element="li" like="dec-1">
            <Link passHref href="/le_scoop">
              <Breadcrumb element="a" like="dec-1">Le Scoop</Breadcrumb>
            </Link>
          </BreadcrumbItem>

          {renderBreadcrumbItem(path, catHref(), category.displayName)}

          {
            subcategory && (
              renderBreadcrumbItem(path, subcatHref(), subcategory.displayName)
            )
          }
        </BreadcrumbList>
      </StyledContent>
    )
  );
};

LeScoopBreadCrumbs.defaultProps = {
  isStory: false,
  category: null,
  subcategory: null
};

LeScoopBreadCrumbs.propTypes = {
  category: PropTypes.object,
  subcategory: PropTypes.object,
  story: PropTypes.bool
};

export default LeScoopBreadCrumbs;
