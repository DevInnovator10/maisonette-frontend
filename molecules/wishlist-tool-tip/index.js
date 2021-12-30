import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';

const ToolTip = styled.div`
  position: absolute;
  width: 212px;
  top: 0rem;
  left: 0%;
  transform: translate(0%, -100%);
  background: ${(props) => props.theme.color.white};
  box-shadow: 0px 2px 4px 0px #00000040;
  border: 1px solid ${(props) => props.theme.color.brandLightBlue};
  color: ${(props) => props.theme.color.bluePrimary};
  z-index: 1;
  
  p {
    letter-spacing: 0;
    line-height: 19.2px;
    padding: 1.2rem 1.6rem;

    a{
      margin-top: 8px;
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    left: 50%;
    transform: translate(-50%, -100%);
  }
`;

const ToolTipContents = styled.div`
  position: relative;

  :after {
    content: '';
    background: ${(props) => props.theme.color.white};
    position: absolute;
    top: calc(100% - 0.5rem);
    right: 50%;
    width: 1rem;
    height: 1rem;
    border-width: 1px;
    border-style: solid;
    transform: rotateZ(45deg);
    border-color: transparent ${(props) => props.theme.color.brandLightBlue} ${(props) => props.theme.color.brandLightBlue} transparent;
  }
`;

const WishlistToolTip = (props) => {
  const toolTipRef = useRef();

  const handleCloseOnOutsideClick = (e) => {
    const { current } = toolTipRef;
    const { target } = e;

    if (current && current === target) {
      return;
    }

    props.showToolTip(false);
  };

  useEffect(() => {
    global.window.addEventListener('click', handleCloseOnOutsideClick);

    return () => {
      global.window.removeEventListener('click', handleCloseOnOutsideClick);
    };
  }, []);

  return (
    <ToolTip role="alert">
      <ToolTipContents>
        <Typography ref={toolTipRef} element="p" like="dec-4">
          You must be logged in to add this to your wishlist
          <br />
          <Link href={'/login'} passHref><a>Log in</a></Link>
        </Typography>
      </ToolTipContents>
    </ToolTip>
  );
};

WishlistToolTip.defaultProps = {
  showToolTip: () => {}
};

WishlistToolTip.propTypes = {
  showToolTip: PropTypes.func
};

export default WishlistToolTip;
