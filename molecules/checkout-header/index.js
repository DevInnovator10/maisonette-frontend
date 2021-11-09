import React, { memo } from 'react';
import styled from '@emotion/styled';

import Link from '../../utils/link';

import LogoIconSVG from '../../public/images/logos/icon.svg';
import LogoTextSVG from '../../public/images/logos/text.svg';

const Header = styled.div`
  align-content: center;
  background-color: ${({ theme }) => theme.color.backgroundLight};
  display: flex;
  height: 8rem;
  justify-content: center;
  position: sticky;
  top: 4.2rem;
  z-index: ${({ theme }) => theme.layers.downstage};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    height: 12.5rem;
    top: -2.2rem;
  }
`;

const HeaderLogo = styled.a`
  align-items: center;
  align-self: center;
  display: inline-flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  /* 28rem = navigation width */
  transform: ${(props) => (props.isActive ? 'translate3d(28rem, 0, 0)' : '')};
  transition: transform ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuart};
  width: auto;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    /* 38rem = navigation width */
    transform: ${(props) => (props.isActive ? 'translate3d(38rem, 0, 0)' : '')};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex: 0 0 auto;
  }
`;

const LogoText = styled(LogoTextSVG)`
  max-width: 123px;
  width: 100%;
`;

const LogoIcon = styled(LogoIconSVG)`
  display: none;
  height: 35px;
  max-width: 28px;
  width: 100%;

  path {
    fill: ${(props) => props.theme.color.brand}
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: block;
    left: 50%;
    margin-bottom: 2.4rem;
  }
`;

const CheckoutHeader = () => (
  <>
    <Header>
      <Link href="/" passHref>
        <HeaderLogo title="Maisonette - Home Page">
          <LogoIcon />
          <LogoText />
        </HeaderLogo>
      </Link>
    </Header>
  </>
);

export default memo(CheckoutHeader);
