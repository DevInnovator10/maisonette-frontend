import React, {
  useEffect, memo, useState
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { getHref } from '../../utils/navigation';
import trackEvent from '../../utils/tracking';
import NoUnderlineLink from '../../atoms/link-no-underline';
import Picture from '../../atoms/picture';
import Typography from '../../atoms/typography';
import IconCircleArrow from '../../atoms/icon-circle-arrow';
import Ruler from '../../atoms/ruler';
import { trackModuleClick } from '../../theme/page';

const Wrapper = styled.section`
  ${(props) => (props.doodleBg ? css`
    width: 100%;
    transform: translateX(-2em);
    background: white;
    background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-white-right.jpg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-white-left.jpg);
    background-repeat: repeat-y;
    background-position: rop right, top left;
    @media screen and (min-width: ${props.theme.breakpoint.medium}) {
      transform: translateX(-6.5vw);
    }
  ` : null)}
`;

const WrapperHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.modularScale.large};
`;

const WrapperTitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
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
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: start;
  justify-content: ${(props) => (props.noWrap ? 'center' : 'space-between')};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-wrap: ${(props) => (props.noWrap ? 'nowrap' : 'wrap')};
    justify-content: ${(props) => (props.noWrap ? 'center' : 'space-between')}
  }
`;

const ItemImage = styled(Picture)`
  margin-bottom: ${(props) => props.theme.modularScale.large};
`;

const Item = styled.article`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;
  padding: 0 1rem;

  ${(props) => (props.paddingsOnMobile ? `
    padding: 0 8px;
  ` : null)}

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

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: calc(25% - 3.75rem);
    padding: 0;
  }

  a {
    text-align: center;
  }
`;

const ItemTitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.base};
  word-break: break-word;
  font-size: ${(props) => props.theme.modularScale.medium};
  ${(props) => (props.uppercase ? 'text-transform: uppercase;' : '')}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    font-size: ${(props) => props.theme.modularScale.large};
  }
`;

const MoreStories = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(Object.values(props?.data?.more_stories ?? []));
  }, []);

  const handleTracking = () => trackEvent({
    eventAction: 'Story',
    eventCategory: 'Content Engagement',
    eventLabel: `You Might Also Like (${props?.data?.more_stories_heading ?? 'Le Scoop Default Story'})`
  });

  return (
    <Wrapper onClick={handleTracking}>
      <WrapperHeader>
        <WrapperTitle element="h1" like="heading-4">
          You might also like...
        </WrapperTitle>
      </WrapperHeader>
      <Items>
        {
          items.map((item, index) => (
            /* eslint-disable react/no-array-index-key, max-len */
            <Item
              key={index}
              onClick={(e) => trackModuleClick(e, { position: index, title: 'story' })}
            >
              <NoUnderlineLink
                href={getHref({ navigation_url: item.more_stories_url })}
              >
                {
                  item?.more_stories_image
                  && (
                    <ItemImage
                      {...item.more_stories_image}
                      circle
                      alt={item.more_stories_image_alt}
                    />
                  )
                }

                {
                  item.more_stories_heading
                    ? (
                      <header>
                        <ItemTitle
                          element="h1"
                          like="heading-5"
                        >
                          {item.more_stories_heading}
                        </ItemTitle>
                      </header>
                    )
                    : null
                }
                <ProductArrowIcon />
              </NoUnderlineLink>
            </Item>
          ))
        }
      </Items>
      {props.data?.more_stories_hr && <Ruler />}
    </Wrapper>
  );
};

MoreStories.propTypes = {
  data: PropTypes.object.isRequired
};

MoreStories.whyDidYouRender = true;

export default memo(MoreStories);
