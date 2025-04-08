import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from '../../utils/link';

import Button from '../../atoms/button';
import CartButton from '../../molecules/cart-icon';
import HeartSVG from '../../atoms/icon-heart';
import LogoIconSVG from '../../public/images/logos/icon.svg';
import LogoTextSVG from '../../public/images/logos/text.svg';
import PetiteDropdownTrigger from '../petite-dropdown-trigger';
import UserGreeting from '../../molecules/user-greeting';
import SearchBar from '../algolia-search';

import withNavigationActions from '../../organisms/navigation';
import { navigationCSS } from '../../theme/page';
import { useEventListener } from '../../utils/hooks';
import { useSearch } from '../../utils/context/search-provider';

const Header = styled.header`
  background-color: ${(props) => props.theme.color.backgroundLight};
  display: flex;
  flex-direction: column;
  position: ${({ isActive }) => (isActive ? 'fixed' : 'sticky')};
  width: 100%;
  top: 42px;
  z-index: ${(props) => props.theme.layers[props.hasSearchResults ? 'balcony' : 'centerstage'] + 10};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    height: 17rem;
    padding-bottom: 0;
    top: -17px;
    z-index: ${(props) => props.theme.layers[props.hasSearchResults ? 'audience' : 'centerstage'] + 10};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    height: auto;
    top: 42px;
  }
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  padding-bottom: 1rem;
  background-color: ${(props) => props.theme.color.backgroundLight};
  border: none;
  flex: 1;
  padding-top: 1rem;
  position: relative;
  transform: ${(props) => (props.isActive ? 'translate3d(28rem, 0, 0)' : '')};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    /* 38rem = navigation width */
    transform: ${(props) => (props.isActive ? 'translate3d(38rem, 0, 0)' : '')};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
  }

  ${navigationCSS}

  padding-left: 0;
  padding-right: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
`;

const HeaderLogo = styled.a`
  align-items: center;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  height: 4.4rem;
  justify-content: center;
`;

const LogoText = styled(LogoTextSVG)`
  max-width: 123px;
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    max-width: 148px;
  }
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
    position: absolute;
    transform: translate(-50%, -130%);
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const DesktopWrapper = styled.div`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: block;
    flex-grow: 1;
    padding: 0 1.6rem 0 3.2rem;
    position: ${(props) => (props.isOpened ? 'static' : 'relative')};
    top: 8px;
  }
`;

const HeaderRight = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-left: auto;
  }
`;

const MenuButton = styled(Button)`
  align-items: center;
  background-color: transparent;
  border-color: transparent;
  display: flex;
  height: 4.4rem;
  width: 4.4rem;
  outline: ${(props) => (props.isActive ? 'none' : 'initial')};
  overflow: initial;
  padding: 1rem;
  position: relative;
  z-index: ${(props) => (props.isActive ? props.theme.layers.audience : 'initial')};

  :hover {
    opacity: 100;
  }

  i,
  i::before,
  i::after {
    display: block;
    background-color: ${(props) => props.theme.color.brand};
    height: 1px;
    transition: transform ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuart};
    width: 100%;
  }

  i {
    text-indent: -9999px;
    position: relative;
    background-color: ${(props) => (props.isActive ? 'transparent' : '')};
    z-index: ${({ theme }) => theme.layers.audience};

    ::before,
    ::after {
      content: '';
      position: absolute;
    }

    ::before {
      top: -7px;
      transform: ${(props) => (props.isActive ? 'translate3d(0, 7px, 0) rotate(-45deg)' : '')};
    }

    ::after {
      bottom: -7px;
      transform: ${(props) => (props.isActive ? 'translate3d(0, -7px, 0) rotate(45deg)' : '')};
    }
  }

  ::after {
    background-color: ${(props) => props.theme.color.background};
    content: '';
    height: ${(props) => (props.isActive ? '200vh' : '0')};
    /*  side navigation width - elem padding - elem border width */
    left: calc(-28rem - 1rem - 2px);
    opacity: ${(props) => (props.isActive ? '0.9' : '0')};
    overflow: hidden;
    position: absolute;
    top: -50vh;
    width: 150vw;
    transition: opacity ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuart};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const PetiteProfileMobileWrapper = styled.div`
  position: sticky;
  top: 156px;
  background-color: ${(props) => props.theme.color.backgroundLight};
  display: flex;
  align-items: flex-start;
  height: 2.8rem;
  max-height: 2.8rem;
  justify-content: center;
  user-select: none;
  transform: translate3d(0,0,0);
  transition: transform ${(props) => props.theme.animation.slow} ease;
  z-index: ${(props) => props.theme.layers.upstage};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const PetiteProfileDesktopWrapper = styled.div`
  display: none;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    background-color: ${(props) => props.theme.color.backgroundLight};
    height: 2.8rem;
    display: flex;
    justify-content: center;
    user-select: none;
    align-items: center;
    height: 4.4rem;
    padding: 1rem;
    position: relative;
  }
`;

const WishlistButton = styled(Button)`
  background-color: transparent;
  border-color: transparent;
  display: none;
  height: 4.4rem;
  outline: ${(props) => (props.isActive ? 'none' : 'initial')};
  overflow: initial;
  padding: 1rem;
  position: relative;
  align-items: center;

  svg {
    display: block;
    height: 2.7rem;
    width: 2.7em;
    fill: transparent;
    stroke: ${(props) => props.theme.color.brand};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
  }
`;

export const NavigationHeader = (props) => {
  const { state: { isOpened } } = useSearch();

  const handleOnNavigationClick = () => {
    props.toggleNavigation(!props.isNavigationActive);
  };

  const handleOnCartClick = () => props.toggleCartModal(!props.isCartActive);

  const isLoggedIn = useCallback(() => !!props.profileEmail, [props.profileEmail]);

  const petiteWrapperRef = useRef();

  let ticking = false;
  let previousY = 0;

  const requestTick = () => {
    const { window } = global;
    const { current } = petiteWrapperRef;

    if (current && !ticking) {
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isScrollingDown = currentY > previousY;

        if (current.style && currentY !== previousY) {
          if (isScrollingDown && currentY > 100) {
            current.style.transform = 'translate3d(0, -97px, 0)';
          } else {
            current.style.transform = 'translate3d(0, 0, 0)';
          }
        }

        previousY = currentY;
        ticking = false;
      });
    }

    ticking = true;
  };

  useEventListener('scroll', requestTick);

  return (
    <>
      <Header hasSearchResults={isOpened} isActive={props.isNavigationActive}>
        <HeaderWrapper isActive={props.isNavigationActive}>
          <MobileWrapper>
            <HeaderLeft>
              <MenuButton
                isIcon
                isActive={props.isNavigationActive}
                onClick={handleOnNavigationClick}
                title="Toggle Navigation"
              >
                <i>Toggle Navigation</i>
              </MenuButton>
            </HeaderLeft>
          </MobileWrapper>

          <Link href="/" passHref>
            <HeaderLogo title="Maisonette - Home Page">
              <LogoIcon />
              <LogoText />
            </HeaderLogo>
          </Link>

          <DesktopWrapper isOpened={isOpened}>
            <SearchBar />
          </DesktopWrapper>

          <HeaderRight>
            <Link href={props.profileId ? '/account' : '/login'} passHref>
              <UserGreeting
                aria-label="account details button"
                isLoggedIn={isLoggedIn()}
                name={props.profileFirstName || undefined}
                title="Account"
                isLink
              />
            </Link>

            {
              isLoggedIn() && (
                <PetiteProfileDesktopWrapper title="Petite Profiles">
                  <PetiteDropdownTrigger />
                </PetiteProfileDesktopWrapper>
              )
            }

            <Link href="/lists/wishlist" passHref>
              <WishlistButton
                aria-label="open wishlist"
                data-test-id="open-wishlist"
                isActive={props.isNavigationActive}
                role="link"
                title="Wish List"
                isLink
              >
                <HeartSVG />
              </WishlistButton>
            </Link>

            <CartButton
              aria-label="open bag"
              data-test-id="open-cart"
              count={props.cartCount}
              onClick={handleOnCartClick}
              title="Bag"
            />
          </HeaderRight>
        </HeaderWrapper>

        <MobileWrapper>
          <SearchBar />
        </MobileWrapper>
      </Header>

      {
        isLoggedIn() && (
          <PetiteProfileMobileWrapper title="Petite Profiles" ref={petiteWrapperRef}>
            <PetiteDropdownTrigger />
          </PetiteProfileMobileWrapper>
        )
      }
    </>
  );
};

NavigationHeader.defaultProps = {
  cartCount: 0,
  isCartActive: false,
  isNavigationActive: false,
  profileId: null,
  profileEmail: null,
  profileFirstName: null,
  toggleCartModal: () => { },
  toggleNavigation: () => { }
};

NavigationHeader.propTypes = {
  cartCount: PropTypes.number,
  isCartActive: PropTypes.bool,
  isNavigationActive: PropTypes.bool,
  toggleCartModal: PropTypes.func,
  toggleNavigation: PropTypes.func,
  profileId: PropTypes.number,
  profileEmail: PropTypes.string,
  profileFirstName: PropTypes.string
};

const ConnectedNavigationHeader = withNavigationActions(NavigationHeader);

ConnectedNavigationHeader.displayName = 'NavigationHeader';

NavigationHeader.whyDidYouRender = true;

export default ConnectedNavigationHeader;
