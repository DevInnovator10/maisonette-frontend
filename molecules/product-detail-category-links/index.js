import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import Link from '../../utils/link';
import Typography from '../../atoms/typography';

/* ***** CONSTANTS ***** */

const STATIC_URLS = {
  'Bestseller Toys': '/shop/play?af=trends%3Abestsellersthisseason',
  Pajamas: '/shop?af=category%3Apajamas',
  'Kids Cold Weather': '/edits/cold-weather/kids',
  'Baby Cold Weather': '/edits/cold-weather/baby',
  'Home Decor': '/shop/home/decor',
  'Mommy and Me': '/edits/mommy-me',
  'Selling Fast This Week': '/trends/selling-fast-this-week',
  'Gifts For Toddlers': '/shop/gifts/by-age/gifts-for-toddlers'
};

const STATIC_LINKS_1 = ['Bestseller Toys', 'Pajamas', 'Kids Cold Weather', 'Baby Cold Weather'];
const STATIC_LINKS_2 = ['Home Decor', 'Mommy and Me', 'Selling Fast This Week', 'Gifts For Toddlers'];

const Statement = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-transform: uppercase;
  margin-left: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-left: 0;
  }
`;

const ArrowSign = styled.div`
  margin-right: 1.5rem;
  display:inline-block;
  width: 12px;
  height: 12px;
  border: solid ${({ theme }) => theme.color.bluePrimary};
  border-width: 2px 0px 0px 2px;
  display: inline-block;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
`;

const NoUnderlineAnchor = styled.a`
  text-decoration: none;
  font-size: ${({ theme }) => theme.modularScale.twenty};
  border-top: 1px solid ${({ theme }) => theme.color.bluePrimary};
  border-bottom: 1px solid ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;

  ~ a {
    border-top: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    font-size: ${({ theme }) => theme.modularScale.twentyFour};
    border-top: 0;
  }
`;

const TextWrapper = styled.div`
  height: 6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  > span {
    margin-left: 1.5rem;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;

  a:last-child {
    border-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    width: 100%;
  }
`;

const CategoryLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.bluePrimary};
  font-family: ${({ theme }) => theme.font.sans};
  margin-top: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    width: 100%;
    margin-top: 1rem;
    flex-direction: row;
    gap: 32px;
  }
`;

const ProductCategoryWrapper = styled.div`
  margin-top: 6rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15rem;
    width: 85%;
  }

`;

const CategoryLink = ({ category }) => (
  <Link href={STATIC_URLS[category]} passHref>
    <NoUnderlineAnchor>
      <TextWrapper>
        <span>{category}</span>
        <ArrowSign />
      </TextWrapper>
    </NoUnderlineAnchor>
  </Link>
);

CategoryLink.propTypes = {
  category: PropTypes.string.isRequired
};

const ProductCategoryLinks = () => (
  <ProductCategoryWrapper>
    <Statement element="p" like="label-4">
      More At Maisonette
    </Statement>

    <CategoryLinksWrapper>
      {
        <Column>
          {
            STATIC_LINKS_1.map((category) => (
              <CategoryLink key={category} category={category} />
            ))
          }
        </Column>
      }
      {
        <Column>
          {
            STATIC_LINKS_2.map((category) => (
              <CategoryLink key={category} category={category} />
            ))
          }
        </Column>
      }
    </CategoryLinksWrapper>
  </ProductCategoryWrapper>
);

export default ProductCategoryLinks;
