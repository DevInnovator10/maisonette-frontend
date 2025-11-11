import React, { memo } from 'react';
import styled from '@emotion/styled';
import { Content } from '../../theme/page';
import Typography from '../../atoms/typography';
import Heading from '../heading';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-align: center;
  padding: 6.4rem 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 6.4rem;
  }
`;

const Team = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -5%;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    flex-direction: row;
    margin: 0;
  }
`;

const TeamMember = styled.div`
  margin: 1.6rem 5%;
  width: 40%;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
      width: 18%;
      max-width: 145px;
      margin: 1.6rem 2%;
  }
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  margin-bottom: 0.8rem;
  height: auto;
`;

const Name = styled(Typography)`
  line-height: 3.2rem;
  margin-bottom: 0.8rem;
`;

const Designation = styled(Typography)`
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const execTeam = [
  {
    image_url: '/images/execs/sylvana-durrett.png',
    name: 'Sylvana Durrett',
    designation: 'Co-founder, ceo'
  },
  {
    image_url: '/images/execs/luisana-mendoza.png',
    name: 'Luisana Mendoza',
    designation: 'co-founder, president'
  }
];

const team = [
  {
    image_url: '/images/execs/aj-nicholas.png',
    name: 'AJ Nicholas',
    designation: 'Chief Operating Officer'
  },
  {
    image_url: '/images/execs/myra-cortado.png',
    name: 'Myra Cortado',
    designation: 'chief financial officer'
  },
  {
    image_url: '/images/execs/taro-naruse.png',
    name: 'Taro Naruse',
    designation: 'Senior vice president of product'
  },
  {
    image_url: '/images/execs/victoria-kasumu.png',
    name: 'Victoria Kasumu',
    designation: 'chief people officer'
  }

];

const MeetTheTeam = () => (

  <Content>
    <Wrapper>
      <Heading data={{ heading_title: 'Meet the team' }} careerUpdate />

      <Team>
        {execTeam.map((member, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TeamMember key={index}>
            <Image src={member.image_url} alt={member.name} />
            <Name element="h3" like="heading-8">{member.name}</Name>
            <Designation element="p" like="dec-5">{member.designation}</Designation>
          </TeamMember>
        ))}
      </Team>

      <Team>
        {team.map((member, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TeamMember key={index}>
            <Image src={member.image_url} alt={member.name} />
            <Name element="h3" like="heading-8">{member.name}</Name>
            <Designation element="p" like="dec-5">{member.designation}</Designation>
          </TeamMember>
        ))}
      </Team>
    </Wrapper>
  </Content>

);

export default memo(MeetTheTeam);
