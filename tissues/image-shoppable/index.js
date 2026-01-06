import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import isUrl from 'is-url';

import { getHref } from '../../utils/navigation';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';

import Picture from '../../atoms/picture';
import Video from '../../atoms/video';
import Ruler from '../../atoms/ruler';

const Wrapper = styled.section``;

const Content = styled.div`
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.4rem;
  padding: 0.3em 0;
  text-align: center;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: flex;
    text-align: left;
  }
`;

const Label = styled(Typography)`
  align-items: center;
  color: ${(props) => props.theme.color.brand};
  display: inline-flex;
  text-transform: uppercase;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding-right: 20px;
    flex: 0 1 auto;
  }
`;

const Products = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 1 1 auto;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;
  }
`;

const ProductLink = styled.li`
  a {
    color: ${(props) => props.theme.color.brandLight};
    cursor: pointer;
    text-decoration: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding-right: 12px;
  }
`;

const parseProducts = ({ image_shoppable_products: products } = {}) => {
  if (!products) throw new Error('Cannot find the `product_elements` property');
  return Object.values(products).map((elem) => Object.values(elem)[0]);
};

const ImageShoppable = (props) => {
  const [videoId, setVideoId] = useState(false);

  useEffect(() => {
    const { image_shoppable_video_url } = props.data;

    if (image_shoppable_video_url) {
      const getVideoId = (url) => {
        const urlParams = new URL(url).searchParams;
        return urlParams?.get?.('v') ?? null;
      };

      setVideoId(
        isUrl(image_shoppable_video_url)
          ? getVideoId(image_shoppable_video_url)
          : image_shoppable_video_url
      );
    }
  }, []);

  return (
    <Wrapper>
      {
        videoId ? (
          <Video videoId={videoId} />
        ) : (
          <Picture
            {...props.data.image_shoppable_image_desktop}
            alt={props.data?.image_shoppable_alt_text}
          />
        )
      }

      {
          Object.values(props.data?.image_shoppable_products ?? {}).length > 0 ? (
            <Content>
              <Label element="h1" like="dec-1">Shop</Label>
              <Products>
                {
              parseProducts(props.data).map((item) => (
                <ProductLink key={item.product_slug}>
                  <Link
                    href={getHref({ navigation_url: `/product/${item?.product_slug ?? item.slug}` })}
                    passHref
                  >
                    <a>
                      { `${item.title}${item.brand ? `, ${item.brand}` : ''};` }
                    </a>
                  </Link>
                </ProductLink>
              ))
            }
              </Products>
            </Content>
          ) : null
      }

      { props.data?.image_shoppable_hr && <Ruler /> }

    </Wrapper>
  );
};

ImageShoppable.propTypes = {
  data: PropTypes.object.isRequired
};

ImageShoppable.whyDidYouRender = true;

export default ImageShoppable;
