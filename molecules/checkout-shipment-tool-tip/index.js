import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import Icon from '../../atoms/icon-cross';

const ToolTip = styled.div`
    position: absolute;
  width: 100%;
  top: 2rem;
  right: 50%;
  transform: translate(50%, -100%);
  background: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.brandLightBlue};
  color: ${(props) => props.theme.color.brand};
  z-index: 1;
  
  p {
    padding: 1.6rem 2.4rem 1.6rem 1.6rem;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 45%;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    top: -1rem;
    right: 0;
    transform: translateY(-100%);
  }
`;

const ToolTipContents = styled.div`
  position: relative;

  :after {
    content: '';
    background: ${(props) => props.theme.color.white};
    position: absolute;
    top: calc(100% - 0.6rem);
    right: calc(50% - 0.6rem);
    width: 1.2rem;
    height: 1.2rem;
    border-width: 1px;
    border-style: solid;
    transform: rotateZ(45deg);
    border-color: transparent ${(props) => props.theme.color.brandLightBlue} ${(props) => props.theme.color.brandLightBlue} transparent;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    :after {
      right: 10%;
    }
  }

`;

const CloseToolTipButton = styled(Button)`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: none;

  line-height: normal;
  border: none;

  padding: 0;
  color: ${(props) => props.theme.color.brand};

  svg {
    height: 1rem;
    width: 1rem;
    stroke-width: 20;
    stroke: ${(props) => props.theme.color.brand};
  }
`;

const ShipmentToolTip = (props) => {
  const toolTipRef = useRef();

  const handleCloseOnOutsideClick = (e) => {
    const { current } = toolTipRef;
    const { target } = e;

    if (current && current === target) {
      return;
    }

    props.closeToolTip();
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
        <CloseToolTipButton
          aria-label="close shipment tool tip"
          onClick={props.closeToolTip}
        >
          <Icon />
        </CloseToolTipButton>
        <Typography ref={toolTipRef} element="p" like="dec-1">
              If you order multiple items, you may get multiple deliveries.
              We’ll send you an email for each shipment, so you’ll know exactly
              what is coming and when to expect it.
        </Typography>
      </ToolTipContents>
    </ToolTip>
  );
};

ShipmentToolTip.defaultProps = {
  closeToolTip: () => {}
};

ShipmentToolTip.propTypes = {
  closeToolTip: PropTypes.func
};

export default ShipmentToolTip;
