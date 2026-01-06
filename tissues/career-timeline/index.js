import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Heading from '../heading';

import TimelineCarousel from '../../organs/careers-timeline-carousel';

const TimelineWrapper = styled.section`
    background-color: #fff;
  padding: 6.4rem 1.6rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 12.8rem 0 12.8rem 6.4rem;
  }
`;

const TimelineButton = styled.a`
  border: 1px solid ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-size: 1.8rem;
  text-decoration: none;
  padding: 1.5rem 4.5rem;
`;

const data = [
  {
    path: '/images/careers-timeline/March2017-Maisonette-Launch.jpg',
    alt: 'Maisonette launches',
    title: 'March 2017',
    subTitle: 'Maisonette launches with Apparel, Home, and Toy categories!',
    year: '2017'
  },
  {
    path: '/images/careers-timeline/February2018-Mommy-Me.jpg',
    alt: 'Mommy & Me Category Launches',
    title: 'February 2018',
    subTitle: 'Mommy & Me category launches with Brock Collection collab',
    year: '2018'
  },
  {
    path: '/images/careers-timeline/May2018-SeriesA-Raise.png',
    alt: 'Series A Raise',
    title: 'May 2018',
    subTitle: 'Series A raise with NEA, Pritzker Group and Thrive Capital',
    year: '2018'
  },
  {
    path: '/images/careers-timeline/June2018-Le-Scoop.jpg',
    alt: 'Le Scoop Launches',
    title: 'June 2018',
    subTitle: 'Our Blog, Le Scoop Launches',
    year: '2018'
  },
  {
    path: '/images/careers-timeline/May2019-Maison-Me.jpg',
    alt: 'Maison Me Launches',
    title: 'May 2019',
    subTitle: 'Our 1st private label, Maison Me launches',
    year: '2019'
  },
  {
    path: '/images/careers-timeline/January2020-Bath-Body.jpg',
    alt: 'Bath & Body Category Launches',
    title: 'January 2020',
    subTitle: 'Bath & Body category launches',
    year: '2020'
  },
  {
    path: '/images/careers-timeline/August2020-Modern-Technology.jpg',
    alt: 'New Marketplace Platform',
    title: 'August 2020',
    subTitle:
      'New marketplace platform launches with modern technology: React, Next.js, AWS, and Ruby on Rails',
    year: '2020'
  },
  {
    path: '/images/careers-timeline/December2020-3x-Growth.png',
    alt: '3x Year-Over-Year Growth',
    title: 'December 2020',
    subTitle: '3x year-over-year growth',
    year: '2020'
  },
  {
    path: '/images/careers-timeline/January2021-Brands-Vendors.jpg',
    alt: '1,300+ brands from 600+ integrated vendors',
    title: 'January 2021',
    subTitle: '1,300+ brands from 600+ integrated vendors',
    year: '2021'
  },
  {
    path: '/images/careers-timeline/February2021-SeriesB-Raise.png',
    alt: 'Series B Raise',
    title: 'February 2021',
    subTitle: 'Series B raise with G Squared, NEA and Thrive Capital',
    year: '2021'
  },
  {
    path: '/images/careers-timeline/June2021-Neon-Rebels.jpg',
    alt: 'Maternity and Pet categories launches',
    title: 'June 2021',
    subTitle:
      'Maternity and Pet categories, plus our 2nd private label Neon Rebels, launch',
    year: '2021'
  },
  {
    path: '/images/careers-timeline/July2021-100-Employees.jpg',
    alt: '100 employees, and counting',
    title: 'July 2021',
    subTitle: '100 employees, and counting!',
    year: '2021'
  }
];

const Timeline = ({ scrollToOpenRoles }) => (
  <TimelineWrapper>
    <Heading
      data={{ heading_title: 'Maisonette through the years' }}
      careerUpdate
    />
    <TimelineCarousel images={data} />
    <TimelineButton onClick={scrollToOpenRoles}>See open roles</TimelineButton>
  </TimelineWrapper>
);

Timeline.propTypes = {
  scrollToOpenRoles: PropTypes.func
};

Timeline.defaultProps = {
  scrollToOpenRoles: PropTypes.func
};

export default Timeline;
