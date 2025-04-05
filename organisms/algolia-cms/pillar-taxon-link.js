import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// components
import router from 'next/router';
import Typography from '../../atoms/typography';

// utils
import Link from '../../utils/link';
import { logAmplitude } from '../../utils/amplitude';
import Picture from '../../atoms/picture';
import formatCatSubcatFromHM from './utils/formatCatSubcatFromHM/index';
import deconstructPath from '../algolia-plp/utils/deconstructPath';

const TaxonCard = styled.a`
    display: flex;
  background: #F4F4F4;
  border-radius: 24px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.66)), #FBEFD8;
  margin-right: 1.6rem;
  text-decoration: none;
  padding: ${({ theme }) => theme.modularScale.eight} ${({ theme }) => theme.modularScale.small};

  h3 {
    align-self: center;
    font-weight: 600;
    font-family: ${({ theme }) => theme.font.sans};
    font-size: ${({ theme }) => theme.modularScale.sixteen};
    white-space: nowrap;

    @media screen and (min-width: ${({ theme }) => theme.breakpoint.medium}) {
      font-size: ${({ theme }) => theme.modularScale.eighteen};
    }
  }
`;

const Image = styled(Picture)`
  width: 24px;
  max-height: 24px;
  margin-right: 12px;
`;

const PillarTaxonLink = ({
  item, staticClick
}) => {
  const {
    category_taxon_shop_element_icon_alt = '',
    category_taxon_shop_element_icon = {},
    category_taxon_shop_row_heading = '',
    category_taxon_shop_taxon_path = ''
  } = item;

  // we want to use the url of the link to set this data
  // instead of the heading, since that is manually entered in the CMS
  // and could possibly be changed for design purposes.
  // use this path to create the hierarchical menu for the link
  const { hierarchicalMenu } = deconstructPath(category_taxon_shop_taxon_path);
  const { categoryData, subcategoryData } = formatCatSubcatFromHM(
    { hierarchicalMenu }
  );

  const handleClick = (e) => {
    e.preventDefault();
    // staticClick is set in the parent component state to keep this onClick from
    // firing during navigation scroll
    if (staticClick) {
      if (subcategoryData) {
        // this means we are on a category page that has links to subcategories
        logAmplitude('Clicked Blog Subcategory', { subcategory: subcategoryData.displayName });
      } else if (categoryData) {
        // this means we are on the Le Scoop homepage that has links to categories
        logAmplitude('Clicked Blog Category', { category: categoryData.displayName });
      }
      router.push(category_taxon_shop_taxon_path);
    }
  };

  return (
    <Link href={category_taxon_shop_taxon_path} passHref>
      <TaxonCard onClick={(e) => handleClick(e)}>
        <Image
          alt={category_taxon_shop_element_icon_alt}
          {...category_taxon_shop_element_icon}
          size="small"
        />
        <Typography element="h3" like="dec-3">{category_taxon_shop_row_heading}</Typography>
      </TaxonCard>
    </Link>
  );
};

PillarTaxonLink.defaultProps = {
  staticClick: false
};

PillarTaxonLink.propTypes = {
  item: PropTypes.object.isRequired,
  staticClick: PropTypes.bool
};

export default PillarTaxonLink;
