import React, { memo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Typography from '../../atoms/typography';
import { Content } from '../../theme/page';

// icons
import Crunchbase from '../../public/images/careers-press-icons/Crunchbase.svg';
import Forbes from '../../public/images/careers-press-icons/Forbes.svg';
import TechCrunch from '../../public/images/careers-press-icons/TechCrunch.svg';
import TheBump from '../../public/images/careers-press-icons/TheBump.svg';

const PressWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.bluePrimary};
  color: ${({ theme }) => theme.color.white};
  text-align: center;
  padding: 3.4rem 0 2.7rem;
`;

const Title = styled(Typography)`
  display: block;
  margin-bottom: 3.4rem;
  @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    font-size: ${({ theme }) => theme.modularScale.thirtyTwo};
  }
`;

const PressCardWrapper = styled.div`
  column-gap: 3.2rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {

    flex-direction: row;
  }
`;

const PressCard = styled.a`
  display: flex;
  flex-direction: column;
  margin-bottom: 3.7rem;

`;

const Text = styled(Typography)`
  color: ${({ theme }) => theme.color.white};
`;

const IconWrapper = styled.div`
  margin-bottom: 2rem;
`;

const IconStyling = css``;

const pressData = [
  {
    platform: 'Tech Crunch',
    text: '"Newly funded Maisonette is becoming a go-to brand for fashion-conscious families; here\'s how"',
    url: 'https://techcrunch.com/2021/02/11/maisonette-is-becoming-a-go-to-brand-for-fashion-conscious-families-heres-the-strategy/',
    icon: <TechCrunch css={IconStyling} />
  },
  {
    platform: 'The Bump',
    text: '"Maisonette to Expand Its In-House Label With the Launch of Maison Me Baby"',
    url: 'https://www.thebump.com/news/maisonette-launch-maison-me-baby',
    icon: <TheBump css={IconStyling} />
  },
  {
    platform: 'Forbes',
    text: '"What Maisonette\'s Founders Can Teach Entrepreneurs About Starting Up"',
    url: 'https://www.forbes.com/sites/anujakhemka/2019/07/17/what-maisonettes-founders-can-teach-mom-entrepreneurs-about-mental-strength-while-starting-up/?sh=1fca2d15db7f',
    icon: <Forbes css={IconStyling} />
  },
  {
    platform: 'crunchbase',
    text: '"Maisonette Lands $30M Series B To Go After $630B Children\'s Products Market"',
    url: 'https://news.crunchbase.com/fintech-ecommerce/maisonette-lands-30m-series-b-to-go-after-630b-childrens-products-market/',
    icon: <Crunchbase css={IconStyling} />
  }
];

const CareerPress = () => (
  <PressWrapper>
    <Content>

      <Title
        element="heading"
        like="heading-9"
      >
        In the press
      </Title>

      <PressCardWrapper>
        {pressData.map((press, i) => (
          <PressCard
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            href={press.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWrapper>
              {press.icon}
            </IconWrapper>
            <Text element="p" like="paragraph-6">{press.text}</Text>
          </PressCard>
        ))}
      </PressCardWrapper>
    </Content>
  </PressWrapper>
);

export default memo(CareerPress);
