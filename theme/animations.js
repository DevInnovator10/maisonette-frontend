import { css } from '@emotion/core';

const animations = css`
  @keyframes arrow-head {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    49.5% {
      transform: translate3d(100px, 0, 0);
      opacity: 1;
    }
    50% {
      transform: translate3d(100px, 0, 0);
      opacity: 0;
    }
    50.5% {
      transform: translate3d(-100px, 0, 0);
      opacity: 0;
    }
    51% {
      transform: translate3d(-100px, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes spin {
    from { transform: rotate(0) }
    to { transform: rotate(359deg) }
  }
`;

export default animations;
