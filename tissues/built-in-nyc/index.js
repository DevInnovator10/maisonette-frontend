import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Heading from '../heading';
import Typography from '../../atoms/typography';

import BuiltInNycCarousel from '../../organs/careers-built-in-nyc-carousel';

const data = [
  {
    imageSrc: '/images/built-in-nyc/DEI_is_a_business_imperative.jpg',
    imageAlt: 'DEI Is a Business Imperative',
    articleUrl: 'https://www.builtinnyc.com/spotlight/2021/04/14/exec-dei-sponsor-interview-maisonette',
    title: 'At This E-Commerce Company, DEI Is a ‘Business Imperative’',
    section: 'insider spotlight'
  },
  {
    imageSrc: '/images/built-in-nyc/22_startups_to_watch.jpg',
    imageAlt: '22 NYC Startups to Watch in 2022',
    articleUrl: 'https://www.builtinnyc.com/2022/02/01/22-nyc-startups-to-watch-2022',
    title: '22 NYC Startups to Watch in 2022',
    section: 'articles we’re in'
  },
  {
    imageSrc: '/images/built-in-nyc/effective_delegation.jpg',
    imageAlt: 'Mastering the Art of Effective Delegation',
    articleUrl: 'https://www.builtinnyc.com/2022/06/28/mastering-art-effective-delegation',
    title: 'Mastering the Art of Effective Delegation',
    section: 'articles we’re in'
  },
  {
    imageSrc: '/images/built-in-nyc/Now_hiring.jpg',
    imageAlt: 'Now Hiring: 13 NYC Companies Gearing Up for Fall',
    articleUrl: 'https://www.builtinnyc.com/2021/08/02/nyc-companies-hiring-august-2021',
    title: 'Now Hiring: 13 NYC Companies Gearing Up for Fall',
    section: 'articles we’re in'
  }
];

const BuiltInNycWrapper = styled.section`
  background-color: #fff;
  padding: 7.2rem 0.8rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 9.6rem 1.6rem;
  }
`;

const Content = styled.section`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    flex-direction: row;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 5.4rem 3.2rem 0 7.2rem;
    align-items: flex-start;
  }
`;

const CarouselWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SubHeading = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-align: center;
  margin: -0.6rem 0 3.2rem;
  padding: 0 1.6rem;
  font-size: 1.8rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    text-align: left;
    width: 296px;
    margin: -2.4rem 0 3.2rem;
    font-size: 2.4rem;
    padding: 0;
  }
`;

const OpenRolesButton = styled.a`
  border: 1px solid ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-size: 1.8rem;
  text-decoration: none;
  padding: 1.5rem 4.5rem;
  margin: 1.6rem auto 0;
  display: table;
`;

const BuiltInNyc = ({ scrollToOpenRoles }) => (
  <BuiltInNycWrapper>
    <Content>
      <HeadingWrapper>
        <Heading
          data={{ heading_title: 'Built in NYC' }}
          careerUpdate
        />
        <SubHeading element="p" like="dec-7">
          People are talking about Maisonette. Read the latest here.
        </SubHeading>
      </HeadingWrapper>
      <CarouselWrapper>
        <BuiltInNycCarousel data={data} />
      </CarouselWrapper>
    </Content>
    <OpenRolesButton onClick={scrollToOpenRoles}>See open roles</OpenRolesButton>
  </BuiltInNycWrapper>
);

BuiltInNyc.propTypes = {
  scrollToOpenRoles: PropTypes.func
};

BuiltInNyc.defaultProps = {
  scrollToOpenRoles: PropTypes.func
};

export default BuiltInNyc;
