import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import Picture from '../../atoms/picture';
import Ruler from '../../atoms/ruler';

const PromoBannerWrapper = styled.section`
`;

const Headline = styled(Typography)`
    color: ${(props) => props.theme.color.brandA11yRed};
  text-align: center;
`;

const PromosWrapper = styled.div`
  display: grid;
  row-gap: 1rem;
`;

const Promo = styled.div``;

const PromoBannerImageDesktop = styled(Picture)`
  display: none;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
`;

const PromoBannerImageMobile = styled(Picture)`
  display: block;
  margin: 0 auto;
  max-width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: none;
  }
`;

const ImageAnchor = styled.a`
  width: 100%;
`;

const PromoBanner = (props) => {
  const renderImages = (element) => {
    if (element.promo_banner_image_desktop && element.promo_banner_image_mobile) {
      return (
        <>
          <PromoBannerImageDesktop
            {...element.promo_banner_image_desktop}
            alt={element.promo_banner_image_desktop_alt}
          />
          <PromoBannerImageMobile
            {...element.promo_banner_image_mobile}
            alt={element.promo_banner_image_mobile_alt}
          />
        </>
      );
    }
    return null;
  };

  return (
    <PromoBannerWrapper>
      {
        props?.data?.promo_banner_headline
        && (
          <Headline element="h2" like="heading-4">
            {props.data.promo_banner_headline}
          </Headline>
        )
      }

      <PromosWrapper>
        {
          Object.values(props?.data?.promo_banner_elements ?? {})
            .map((element, index) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <Promo key={`promo-banner-${index}`}>
                {element.promo_banner_url
                  ? (
                    <Link
                      href={`${element.promo_banner_url}?td=promo-banner-module`}
                      passHref
                    >
                      <ImageAnchor>
                        {renderImages(element)}
                      </ImageAnchor>
                    </Link>
                  )
                  : renderImages(element)}
              </Promo>
            ))
        }
      </PromosWrapper>

      {props?.data?.promo_banner_hr && <Ruler />}

    </PromoBannerWrapper>
  );
};

PromoBanner.propTypes = {
  data: PropTypes.object.isRequired
};

PromoBanner.whyDidYouRender = true;

export default PromoBanner;
