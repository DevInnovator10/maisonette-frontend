import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getHref } from '../../utils/navigation';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import Picture from '../../atoms/picture';
import Icon from '../../atoms/icon-arrow';
import Ruler from '../../atoms/ruler';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin: 0 0 ${(props) => props.theme.modularScale['2xlarge']};
  text-align: center;
  a {
    text-decoration: none;
    font-family: inherit;
  }
`;

const Content = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin: ${(props) => props.theme.modularScale['2xlarge']} 0;
  text-align: center;
`;

const BannerElements = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: ${(props) => props.theme.width.medium}) {
    flex-direction: row;
  }
`;

const BannerElement = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media screen and (min-width: ${(props) => props.theme.width.medium}) {
    width: calc(25% - 0.5rem);
  }
`;

const AnchorWrap = styled.a`
  text-decoration: none;
  text-align: center;
`;

const RowMainImage = styled(Picture)`
  > img {
    border-radius: 100%;
  }
`;

const RowIconImage = styled(Picture)`
  transform: translateY(-50%);
  > img {
    border-radius: 100%;
  }
`;

const RowCta = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  padding: ${(props) => props.theme.modularScale['2xlarge']} ${(props) => props.theme.modularScale.base} ${(props) => props.theme.modularScale.base};

  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
`;

const IconArrow = styled(Icon)`
  height: 1rem;
  width: 1rem;
  fill: ${(props) => props.theme.color.brand};
`;

const BannerRow = (props) => (
  <section>
    <Title element="h1" like="heading-3">
      {props.data.banner_row_heading_url ? (
        <Link href={props.data.banner_row_heading_url}>
          <a>
            {props.data.banner_row_heading}
          </a>
        </Link>
      ) : props.data.banner_row_heading}
    </Title>
    <Content element="h2" like="paragraph-2">
      {props.data.banner_row_content}
    </Content>
    {props.data?.banner_row_elements
      ? (
        <BannerElements>
          {Object.keys(props.data.banner_row_elements).map((element) => (
            <BannerElement key={element}>
              <Link
                href={getHref({ navigation_url: props.data.banner_row_elements[element]?.banner_row_element_url ?? '/' })}
                passHref
              >
                <AnchorWrap href={props.data.banner_row_elements[element]?.banner_row_element_url ?? '/'}>
                  {props.data.banner_row_elements[element]?.banner_row_element_image
                    && (
                      <RowMainImage
                        {...props.data.banner_row_elements[element].banner_row_element_image}
                        alt={props.data.banner_row_elements[element].banner_row_element_image_alt}
                      />
                    )}
                  {props.data?.banner_row_elements[element]?.banner_row_icon_boolean
                    && (
                    <>
                      <RowIconImage
                        {...props.data.banner_row_elements[element].banner_row_element_icon}
                        alt={props.data.banner_row_elements[element].banner_row_element_icon_alt}
                      />
                      <IconArrow />
                    </>
                    )}
                  <RowCta element="p" like="dec-1">
                    {props.data.banner_row_elements[element].banner_row_element_cta
                      && props.data.banner_row_elements[element].banner_row_element_cta !== ''
                      ? props.data.banner_row_elements[element].banner_row_element_cta : 'SHOP NOW'}
                  </RowCta>
                </AnchorWrap>
              </Link>
            </BannerElement>
          ))}
        </BannerElements>
      )
      : null}
    {props.data?.banner_row_hr && <Ruler />}
  </section>
);

BannerRow.propTypes = {
  data: PropTypes.object.isRequired
};

BannerRow.whyDidYouRender = true;

export default BannerRow;
