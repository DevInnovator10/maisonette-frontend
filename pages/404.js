import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import { Page, Content } from '../theme/page';
import Typography from '../atoms/typography';
import Button from '../atoms/button';
import TaxonShop from '../tissues/category-taxon-shop';

const PageContent = styled(Content)`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  margin-bottom: ${(props) => props.theme.modularScale.base};
  width: 120px;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.xlarge};
`;

const Body = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.large};
  max-width: 380px;
  text-align: center;
  width: 100%;
`;

const Cta = styled(Button)`
  margin-bottom: ${(props) => props.theme.modularScale['4xlarge']};
`;

const taxonData = {
  category_taxon_shop_one_line: true,
  category_taxon_shop_heading: 'Shop by Category',
  category_taxon_shop_as_taxon: false,
  category_taxon_shop_elements: [
    {
      category_taxon_shop_taxon_path: '/shop/baby',
      category_taxon_shop_element_icon: {
        types: ['png'],
        imageName: 'images/404/maisonette-baby.png',
        uri: ''
      },
      category_taxon_shop_row_heading: 'Baby'
    },
    {
      category_taxon_shop_taxon_path: '/shop/kids',
      category_taxon_shop_element_icon: {
        types: ['png'],
        imageName: 'images/404/maisonette-kids.png',
        uri: ''
      },
      category_taxon_shop_row_heading: 'Kids'
    },
    {
      category_taxon_shop_taxon_path: '/shop/play',
      category_taxon_shop_element_icon: {
        types: ['png'],
        imageName: 'images/404/maisonette-play.png',
        uri: ''
      },
      category_taxon_shop_row_heading: 'Play'
    },
    {
      category_taxon_shop_taxon_path: '/shop/home',
      category_taxon_shop_element_icon: {
        types: ['png'],
        imageName: 'images/404/maisonette-home.png',
        uri: ''
      },
      category_taxon_shop_row_heading: 'Home'
    },
    {
      category_taxon_shop_taxon_path: '/shop/gifts',
      category_taxon_shop_element_icon: {
        types: ['png'],
        imageName: 'images/404/maisonette-gifts.png',
        uri: ''
      },
      category_taxon_shop_row_heading: 'Gifts'
    }
  ]
};

const FourOhFour = () => {
  useEffect(() => {
    global.window.scrollTo(0, 0);
  }, []);

  return (
    <Page background="cream">
      <PageContent layout="large">
        <figure>
          <Image src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/error.png`} alt="Error" />
        </figure>
        <Title element="h3" like="heading-4">Page Not Found!</Title>
        <Body element="p" like="paragraph-2">
          Seems you’ve fallen down the rabbit hole. Make like Alice and find your way back by
          choosing a category below. No eating little cakes required.
        </Body>
        <Cta outline isLink href="/">Go to homepage</Cta>
      </PageContent>
      <Content>
        <TaxonShop data={taxonData} uppercaseTitles paddingsOnMobile />
      </Content>
    </Page>
  );
};

export default FourOhFour;
