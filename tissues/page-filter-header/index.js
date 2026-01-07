import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logAmplitude } from '../../utils/amplitude';
import Typography from '../../atoms/typography';
import { StyledContent } from '../../theme/page';
import Button from '../../atoms/button';

import salePromotions from './utils/salePromotions.json';

const SectionWrapper = styled.section`
  background-color: ${(props) => props.theme.color.brandNeutral};
  position: relative;
  z-index: ${({ theme }) => theme.layers.backstage};

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    align-items: center;
    display: flex;
    min-height: ${(props) => (props.hasImage ? 'calc(35rem + 6rem)' : '150px')};
  }

  ::before,
  ::after {
    background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-header-bg.jpg);
    background-repeat: no-repeat;
    content: "";
    height: 100%;
    position: absolute;
    top: 0;
    width: 550px;
    z-index: -1;

    @media (min-width: ${(props) => props.theme.breakpoint.small}) {
      max-width: 50%;
    }
  }

  ::before {
    background-position: 0 0;
    display: none;
    left: 0;

    @media (min-width: ${(props) => props.theme.breakpoint.small}) {
      display: block;
    }
  }

  ::after {
    background-position: right 0;
    right: 0;
  }

  ${StyledContent} {
    width: 100%;

    @media (min-width: ${(props) => props.theme.breakpoint.small}) {
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
`;

const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;

  @media (min-width: ${(props) => props.theme.breakpoint.large}) {
    padding: 3rem 0;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex: 0 0 auto;
    width: auto;
  }
`;

const Heading = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.2;
  font-size: ${({ theme }) => theme.modularScale.thirtyTwo};
`;

const SubHeading = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  letter-spacing: 0.24em;
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  margin-bottom: ${({ theme }) => theme.modularScale.twentyFour};
  text-transform: uppercase;

  @media (min-width: ${({ theme }) => theme.breakpoint.small}) {
    margin-bottom: ${({ theme }) => theme.modularScale.sixteen};
  }
`;

const Paragraph = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.5;
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  margin-top: ${({ theme }) => theme.modularScale.twentyFour};
  max-width: 425px;
`;

const HeaderFigure = styled.figure`
  justify-content: center;
  width: 192px;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex: 0 0 auto;
    margin-left: auto;
    width: 224px;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-left: 60px;
    width: 304px;
  }

  ${(props) => (props.mobile ? `
    margin-top: ${props.theme.modularScale.sixteen};

    @media (min-width: ${props.theme.breakpoint.small}) {
      display: none;
    }
  ` : `
    display: none;

    @media (min-width: ${props.theme.breakpoint.small}) {
      display: block;
    }
  `)}
`;

const HeaderImage = styled.img`
  display: block;
  border-radius: 9999px;
  max-width: 100%;
`;

const FilterWrapper = styled.div`
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(2, minmax(0, 15.1rem));
  height: 3.5rem;
  margin-top: ${(props) => props.theme.modularScale.twentyFour};

  @media (min-width: ${(props) => props.theme.breakpoint.large}) {
    grid-template-columns: repeat(2, minmax(0, 13.8rem));
  }
`;

const FilterLink = styled(Button)`
  display: flex;
  flex-basis: 100%;
  justify-content: center;
  line-height: 2.8rem;
  letter-spacing: .15em;
  padding: 0;
`;

const Filters = (props) => {
  // ?? {} used to load router on server
  const router = useRouter() ?? {};

  const isFacetActive = (filterPath) => {
    const url = new URL(router?.asPath, process.env.NEXT_PUBLIC_CLIENT_HOST);
    const pathWithoutHierMenuAndFilters = (() => {
      const slugs = url.pathname.split('/');
      const hasHierMenu = slugs.length > 3;
      return !hasHierMenu ? url.pathname : `/${slugs[1]}/${slugs[2]}`;
    })();

    // reverse boolean because of the atom Button styling
    return filterPath !== pathWithoutHierMenuAndFilters;
  };

  if (!props.filters || props.filters.length === 0) return null;

  return (
    <FilterWrapper>
      {
        props.filters.map((button, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Link key={`headerfilter${i}`} href={button.path} passHref>
            <FilterLink
              outline={isFacetActive(button.path)}
              text={button.buttonText}
              isLink
              filterBtn
              onClick={() => {
                logAmplitude('Clicked Header Button', { clickedButton: button.buttonText });
              }}
            />
          </Link>
        ))
      }
    </FilterWrapper>
  );
};

Filters.defaultProps = {
  filters: []
};

Filters.propTypes = {
  filters: PropTypes.array
};

const PageFilterHeader = (props) => {
  const router = useRouter() ?? {};
  const { asPath } = router;
  const path = asPath?.split('?')[0] ?? '';

  const promotion = salePromotions[props.currentPromotion];
  const displayedHeading = promotion?.heading?.[path] ?? null;

  return (
    <SectionWrapper hasImage={promotion.image}>
      <StyledContent>
        <HeaderContent>
          <header>
            {props.children}

            {
              promotion.subHeading
                ? <SubHeading element="h2" like="label-1">{promotion.subHeading}</SubHeading>
                : ''
            }

            {
              displayedHeading
                ? <Heading element="h1" like="heading-3">{displayedHeading}</Heading>
                : ''
            }
          </header>

          {
            promotion.text
              ? <Paragraph element="p" like="paragraph-2">{promotion.text}</Paragraph>
              : ''
          }
          <Filters filters={promotion?.filters || []} />
        </HeaderContent>

        {
          promotion.image && (
            <HeaderFigure>
              <HeaderImage src={promotion.image} alt={promotion.heading} />
            </HeaderFigure>
          )
        }

      </StyledContent>
    </SectionWrapper>
  );
};

PageFilterHeader.defaultProps = {
  children: null
};

PageFilterHeader.propTypes = {
  children: PropTypes.node,
  currentPromotion: PropTypes.string.isRequired
};

export default PageFilterHeader;
