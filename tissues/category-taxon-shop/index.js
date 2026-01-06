import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { getHref } from '../../utils/navigation';
import trackEvent from '../../utils/tracking';
import NoUnderlineLink from '../../atoms/link-no-underline';
import Picture from '../../atoms/picture';
import Button from '../../atoms/button';
import Typography from '../../atoms/typography';
import IconCircleArrow from '../../atoms/icon-circle-arrow';
import Ruler from '../../atoms/ruler';
import PillarCategoryTaxonShop from '../../organisms/algolia-cms/pillar-taxon-shop-module';
import HomepageShopBy from '../homepage-shop-by/index';

const Wrapper = styled.section`
  padding: 0;

  ${(props) => !props.noWrap && css`
    width: calc(100% + 4em);
    transform: translateX(-2em);
  `}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    transform: translateX(-6.5vw);
    width: calc(100% + 13vw);
    padding: ${(props) => (props.noWrap ? '0 6.5vw' : '0 6.5vw 0')};
  }

  ${(props) => (props.doodleBg ? css`
    background: white;
    background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-white-right.jpg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-white-left.jpg);
    background-repeat: repeat-y;
    background-position: rop right, top left;
  ` : null)}
`;

const WrapperHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.modularScale.large};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-bottom: ${(props) => props.theme.modularScale.xlarge};
  }
`;

const WrapperTitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: normal;

  a {
    text-decoration: none;
    font-family: inherit;
  }
`;

const WrapperSubtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const Cta = styled(Button)`
  border: none;
  border-bottom: .2rem solid ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.brand};
  display: inline-block;
  font-family: ${(props) => props.theme.font.caption};
  font-size: ${(props) => props.theme.modularScale.small};
  padding-bottom: .8rem;
  position: relative;
  text-transform: uppercase;
  line-height: 1rem;
  letter-spacing: .24rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-bottom: ${(props) => props.theme.modularScale.small};
  }
`;

const ProductArrowIcon = styled(IconCircleArrow)`
  height: 2.7rem;
  width: 2.7rem;

  circle,
  path {
    fill: none;
    stroke: ${(props) => props.theme.color.brand};
    stroke-width: 4;
    transform: translate3d(0, 0, 0);
  }
`;

const Items = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-wrap: ${(props) => (props.noWrap ? 'nowrap' : 'wrap')};
    justify-content: space-between;
  }
`;

const ItemImage = styled(Picture)`
  margin-bottom: ${(props) => props.theme.modularScale.small};
  width: 100%;

    ${(props) => (props.noWrap ? css`
      img {
        max-height: 160px;
        object-fit: contain;
      }
    ;` : null)}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin-bottom: ${(props) => props.theme.modularScale.medium};
  }
`;

const Item = styled.article`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => (props.noWrap ? '25%' : '50%')};
  padding: 0;
  margin-bottom: ${(props) => props.theme.modularScale.large};


  &:hover {

    ${ItemImage} {
      ${(props) => (props.wiggleOnHover ? css`
      animation-duration: 0.4s;
      animation-name: ${props.theme.animations.wiggle};
      ` : null)}
    }

    ${ProductArrowIcon} path {
      animation: arrow-head;
        animation-duration: ${(props) => props.theme.animation.slow};
        animation-timing-function: ${(props) => props.theme.animation.easeMove};
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-play-state: running;
    }
  }

  a {
    text-align: center;
    width: 90%;

    @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
      width: 100%;
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 23%;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-shrink: ${(props) => (props.noWrap ? '1' : '0')};
    width: ${(props) => (props.noWrap ? '130px' : '23%')};
    margin-bottom: ${(props) => props.theme.modularScale.xlarge};
  }

  // ensures items will display evenly spaced when there are less than 3 in a row
  // but keeps the behavior of justify-content: space-between
  ${(props) => !props.noWrap && css`
    @media screen and (min-width: ${props.theme.breakpoint.medium}) {
      :nth-last-of-type(-n + ${props.itemLength % 4}) {
          margin: 0 auto 0;
      }
    }
  `}

  // below handles the bottom margin for the items in the bottom row of each module
  // to ensure they are flush with the bottom of the module
  :nth-last-of-type(-n + ${(props) => props.itemLength % 2 || 2}) {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    :nth-last-of-type(-n + ${(props) => props.itemLength % 4 || 4}) {
      margin-bottom: 0;
    }
  }

  ${(props) => props.noWrap && css`
    // if noWrap, on 'mobile', items will be in rows of 4 at most
    :nth-last-of-type(-n + ${props.itemLength % 4 || 4}) {
      margin-bottom: 0;
    }

    @media screen and (min-width: ${props.theme.breakpoint.medium}) {
      margin-bottom: 0;
    }
  `};
`;

const ItemTitle = styled(Typography, { shouldForwardProp: (prop) => prop !== 'uppercase' })`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.small};
  line-height: 1.41;
  word-break: break-word;


  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-bottom: ${(props) => props.theme.modularScale.medium};
  }

  ${(props) => props.uppercase && css`
    text-transform: uppercase;
    letter-spacing: 0.24em;
  `}
`;

const ItemSubtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.medium};
`;

const TaxonShop = (props) => {
  const items = props?.data?.category_taxon_shop_elements
    ? Object.values(props.data.category_taxon_shop_elements)
    : [];

  if (props.pillar) return <PillarCategoryTaxonShop {...props} items={items} />;

  const contentCheck = () => props.data.category_taxon_shop_heading
    || props.data.category_taxon_shop_subheading
    || props.data.category_taxon_shop_title_url;

  const handleTracking = () => trackEvent({
    eventAction: 'Homepage',
    eventCategory: 'Content Engagement',
    eventLabel: `Content Slot 7 (${props?.data?.category_taxon_shop_heading ?? 'Category Taxon Shop'})`
  });

  if (props.homepage && props.data.category_taxon_shop_one_line
    && !props.data.category_taxon_shop_as_taxon) {
    // TODO: this will eventually become its own module in the CMS
    // but in the meantime, we can use this component with the
    // understanding that the user will select one option (Display on one line)
    // in the CMS and the module will only be on the homepage and only contain 8 items.
    return <HomepageShopBy {...props} />;
  }

  return (
    <Wrapper
      noWrap={props.data?.category_taxon_shop_one_line}
      doodleBg={
        props.data?.category_taxon_shop_bg_doodles || props?.data?.white_background_with_doodles
      }
      onClick={handleTracking}
    >
      {
        contentCheck() && (
          <WrapperHeader>
            {
              props.data.category_taxon_shop_heading
                ? (
                  <WrapperTitle element="h1" like="heading-4">
                    {props.data.category_taxon_shop_title_url ? (
                      <Link href={props.data.category_taxon_shop_title_url}>
                        <a>
                          {props.data.category_taxon_shop_heading}
                        </a>
                      </Link>
                    ) : props.data.category_taxon_shop_heading}
                  </WrapperTitle>
                )
                : null
            }

            {
              props.data.category_taxon_shop_subheading
                ? (
                  <WrapperSubtitle element="h2" like="paragraph-4">
                    {props.data.category_taxon_shop_title_url ? (
                      <Link href={props.data.category_taxon_shop_title_url}>
                        <a>
                          {props.data.category_taxon_shop_subheading}
                        </a>
                      </Link>
                    ) : props.data.category_taxon_shop_subheading}
                  </WrapperSubtitle>
                )
                : null
            }

            {
              props.data.category_taxon_shop_title_url
                ? (
                  <NoUnderlineLink
                    href={getHref({ navigation_url: props.data.category_taxon_shop_title_url })}
                  >
                    <Cta isText inverted>
                      {props.data?.category_taxon_shop_cta ?? 'VIEW ALL'}
                    </Cta>
                  </NoUnderlineLink>
                )
                : null
            }
          </WrapperHeader>
        )
      }

      <Items noWrap={props.data?.category_taxon_shop_one_line}>
        {
          items.map((item, index) => (
            /* eslint-disable react/no-array-index-key, max-len */
            <Item
              noWrap={props.data?.category_taxon_shop_one_line}
              key={index}
              itemLength={items?.length}
              wiggleOnHover={!props.data.category_taxon_shop_as_taxon}
              paddingsOnMobile={props.data.category_taxon_shop_as_taxon || props.paddingsOnMobile}
            >
              <NoUnderlineLink
                href={getHref({ navigation_url: item.category_taxon_shop_taxon_path })}
                fullWidth
              >
                {
                  item?.category_taxon_shop_element_icon
                  && (
                    <ItemImage
                      noWrap={props.data?.category_taxon_shop_one_line}
                      alt={item.category_taxon_shop_element_icon_alt}
                      {...item.category_taxon_shop_element_icon}
                      circle={!!item?.category_taxon_shop_element_image_type || item?.display_image_as_circle}
                      disableLazyload={props.disableLazyload}
                    />
                  )
                }

                {
                  item.category_taxon_shop_row_heading
                    ? (
                      <header>
                        {item?.category_taxon_shop_row_sub_heading
                          && (
                            <ItemSubtitle element="h2" like="dec-1">
                              {item.category_taxon_shop_row_sub_heading}
                            </ItemSubtitle>
                          )}

                        <ItemTitle
                          element={props.data.category_taxon_shop_as_taxon
                            ? 'h1'
                            : 'h6'}
                          like={props.data.category_taxon_shop_as_taxon

                            ? 'heading-5'
                            : 'label-1'}
                          uppercase={
                            props.uppercaseTitles
                            || props.data.category_taxon_shop_one_line
                          }
                        >
                          {item.category_taxon_shop_row_heading}
                        </ItemTitle>
                      </header>
                    )
                    : null
                }
                {
                  // eslint-disable-next-line no-nested-ternary
                  item.category_taxon_shop_taxon_path
                    ? (
                      !props.data?.category_taxon_shop_as_taxon
                        ? <ProductArrowIcon />
                        : (
                          <Cta isText inverted href={item.category_taxon_shop_taxon_path}>
                            {item?.category_taxon_shop_taxon_cta ?? 'SHOP NOW'}
                          </Cta>
                        )
                    )
                    : null
                }
              </NoUnderlineLink>
            </Item>
          ))
        }
      </Items>
      {props.data?.category_taxon_shop_hr && <Ruler />}
    </Wrapper>
  );
};

TaxonShop.defaultProps = {
  uppercaseTitles: false,
  paddingsOnMobile: false,
  disableLazyload: false,
  pillar: false,
  homepage: false
};

TaxonShop.propTypes = {
  data: PropTypes.object.isRequired,
  uppercaseTitles: PropTypes.bool,
  paddingsOnMobile: PropTypes.bool,
  disableLazyload: PropTypes.bool,
  pillar: PropTypes.bool,
  homepage: PropTypes.bool
};

TaxonShop.whyDidYouRender = true;

export default TaxonShop;
