import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import ZScript from '../../utils/zdeskScript';

const Button = styled.button`
  background: ${(props) => props.theme.color.brand};
  border-radius: 9999px;
  border: 0 none;
  color: #fbefd8;
  cursor: pointer;
  fill: #fbefd8;
  height: 48px;
  padding: 0;
  min-width: 48px;
  font-size: 16px;
  letter-spacing: 0.6;
  font-weight: 700;

  position: fixed;
  right: 0;
  bottom: 0;
  margin: 11px 21px;

  :focus {
    box-shadow: inset 0 0 0 3px rgba(251, 239, 216, 0.3) !important;
  }

  span {
    display: inline-block;
    vertical-align: middle;

    :first-child {
      height: 20px;
      width: 20px;
    }

    :last-child {
      display: none;
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    min-width: 108px;
    height: 46px;
    margin: 13px 21px;
    padding: 0 16px;

    span {
      :first-child {
        margin-right: 9px;
      }

      :last-child {
        display: inline-block;
      }
    }
  }
`;

const Widget = () => {
  const [clicked, setClicked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleOnClick = () => {
    setClicked(true);
  };

  useEffect(() => {
    if (loaded) {
      global.window.zdonload = setInterval(() => {
        if (typeof global.zE !== 'undefined' && typeof global.zE.activate !== 'undefined') {
          global.zE.activate();
          clearInterval(global.window.zdonload);
        }
      }, 50, null);
    }
  }, [loaded]);

  return (
    <>
      {
        !loaded && (
          <Button type="button" aria-label="Launch Help Chat Window" onClick={handleOnClick}>
            <span>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <title />
                <g id="Layer_4">
                  <path d="M11,12.3V13c0,0-1.8,0-2,0v-0.6c0-0.6,0.1-1.4,0.8-2.1c0.7-0.7,1.6-1.2,1.6-2.1c0-0.9-0.7-1.4-1.4-1.4 c-1.3,0-1.4,1.4-1.5,1.7H6.6C6.6,7.1,7.2,5,10,5c2.4,0,3.4,1.6,3.4,3C13.4,10.4,11,10.8,11,12.3z" />
                  <circle cx="10" cy="15" r="1" />
                  <path d="M10,2c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S5.6,2,10,2 M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0 L10,0z" />
                </g>
              </svg>
            </span>
            <span>{clicked ? 'Loading...' : 'Help'}</span>
          </Button>
        )
      }

      {clicked && <ZScript setLoaded={setLoaded} />}
    </>
  );
};

export default Widget;
