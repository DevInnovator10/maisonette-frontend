import React, {
    useEffect,
  useRef,
  useCallback,
  memo
} from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import IconButton from '../../molecules/icon-button';
import IconCircleArrow from '../../atoms/icon-circle-arrow';

const StickyWrapper = styled.div`
  // this element is needed to create the sticky behavior without
  // creating a layout shift when the element is removed on scroll
  height: 0;
  position: sticky;
  bottom: 0;
  z-index: ${({ theme }) => theme.layers.downstage - 1};
`;

const ButtonWrapper = styled.span`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  transition: visibility ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad},
    opacity ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    right: 3rem;
  }
`;

const TopButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'background' })`
  align-items: center;
  background-color: ${({ background, theme }) => (background ? theme.color.background : theme.color.white)};
  border: 0;
  bottom: 0;
  color: ${(props) => props.theme.color.brand};
  display: inline-flex;
  flex-direction: column;
  left: 0;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  max-height: fit-content;
  outline: 0;
  width: 6rem;

  svg {
    transform: rotate(-90deg);
    margin: 0;
    stroke: ${(props) => props.theme.color.brand};

    path {
      transform: translate3d(0, 0, 0);
    }
  }

  i {
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  :focus,
  :hover,
  :active {
    svg {
      path {
        animation: arrow-head;
        animation-duration: ${(props) => props.theme.animation.slow};
        animation-timing-function: ${(props) => props.theme.animation.easeMove};
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-play-state: running;
      }
    }
  }
`;

const BackToTop = (props) => {
  const ref = useRef();
  const { window } = global;
  let previousY = window?.scrollY;

  const requestTick = useCallback(() => {
    const { current } = ref;
    let ticking = false;

    if (current && !ticking) {
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const scrollingUp = currentY < previousY;
        if (current.style) {
          if (scrollingUp && currentY !== 0) {
            current.style.visibility = 'visible';
            current.style.opacity = 1;
          } else {
            current.style.visibility = 'hidden';
            current.style.opacity = 0;
          }
        }
        previousY = currentY;
        ticking = false;
      });
    }

    ticking = true;
  }, [ref]);

  useEffect(() => {
    global.window.addEventListener('scroll', requestTick, false);
  }, []);

  return (
    <StickyWrapper>
      <ButtonWrapper ref={ref}>
        <TopButton
          text="To Top"
          background={props.background}
          clicked={() => global.window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <IconCircleArrow strokeWidth={3} />
        </TopButton>
      </ButtonWrapper>
    </StickyWrapper>
  );
};

BackToTop.defaultProps = {
  background: false
};

BackToTop.propTypes = {
  background: PropTypes.bool
};

export default memo(BackToTop);
