import { keyframes } from '@emotion/core';

const animation = {
  fast: '200ms',
  default: '400ms',
  slow: '600ms',
  easeInQuad: 'cubic-bezier(0.550, 0.085, 0.68, 0.530)',
  easeOutQuad: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
  easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
  easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1)',
  easeMove: 'cubic-bezier(0.15, 0.8, 0.3, 1.2)'
};

const animations = {
  wiggle: keyframes`
    0%  { transform: rotate(0) }
    25% { transform: rotate(6deg) }
    50% { transform: rotate(0deg) scale(1.025) }
    75% { transform: rotate(-6deg) }
    100% { transform: rotate(0) }
  `,
  pulse: keyframes`
    from { transform: scale3d(1, 1, 1) }
    50%  { transform: scale3d(1.05, 1.05, 1.05)}
    to   { transform: scale3d(1, 1, 1) }
  `,
  fadeInFromNothing: keyframes`
    0% {
      display: none;
      opacity: 0;
    }

    1% {
      display: block;
      opacity: 0;
    }

    100% {
      display: block;
      opacity: 1;
    }
  `,
  stickyAppear: keyframes`
    from {
      transform: translateY(50%);
    }
    50% {
      transition: transform 200ms ease-in;
    }
    to {
      transform: translateY(0);
    }
  `,
  stickyDisappear: keyframes`
    from {
      transform: translateY(0);
    }
    50% {
      transition: transform 200ms ease-in;
    }
    to {
      transform: translateY(100%);
    }
  `
};

const badges = {
  mostwished: '#CC3112',
  popular: '#CC3112',
  sellingfast: '#CC3112',
  justin: '#CC3112',
  onsale: '#CC3112',
  lowstock: '#CC3112',
  backinstock: '#CC3112',
  exclusive: '#CC3112',
  monogrammable: '#CC3112'
};

const breakpoint = {
  'x-small': '425px',
  small: '768px',
  medium: '992px',
  large: '1200px',
  max: (bp) => `${parseInt(breakpoint[bp], 10) - 1}px`
};

const color = {
  background: '#FAEFD9',
  backgroundGreen: '#008761',
  backgroundLight: '#FCF8E8',
  backgroundLightBlue: '#F5F6FA',
  black: '#111111',
  bluePrimary: '#2F4DA1',
  borderBlue: '#8592BE',
  brand: '#3150A2',
  brandA11yRed: '#C84D19',
  brandError: '#f86B4E',
  brandGreen: '#4B8B52',
  brandLight: '#9CB1DC',
  brandLightBlue: '#5971B4',
  brandNeutral: '#FAEFD9',
  brandBorder: '#CBD2E7',
  darkBlue: '#1F3E8F',
  grey: '#C4C4C4',
  norwayGreen: '#97ba90',
  afterpayMint: '#B2FCE4',
  paypalYellow: '#FFC439',
  paypalYellowHover: '#F3BA38',
  peach: '#CC8783',
  promoPink: '#F9BEC4',
  redError: '#CC3112',
  softNavy: '#616FA8',
  white: '#FFFFFF'
};

const constants = {
  vestibuleHeight: {
    mobile: '182px',
    desktop: '255px'
  },
  globalSearchHeight: '150px',
  promotionHeight: '50px'
};

const layers = {
  backstage: 1,
  upstage: 1000,
  centerstage: 2000,
  downstage: 3000,
  audience: 4000,
  balcony: 5000,
  box: 6000
};

const font = {
  sans: 'GT Walsheim Web, Helvetica, Trebuchet MS, sans-serif',
  caption: 'GT Pressura Web, Arial Narrow, Arial, sans-serif',
  heading: 'Canela Web, Big Caslon, Times New Roman, Times, serif'
};

const modularScale = {
  eight: '0.8rem',
  small: '1.2rem',
  thirteen: '1.3rem',
  fourteen: '1.4rem',
  sixteen: '1.6rem',
  base: '1.5rem',
  eighteen: '1.8rem',
  medium: '1.875rem',
  twenty: '2rem',
  large: '2.3438rem',
  twentyFour: '2.4rem',
  twentyEight: '2.8rem',
  xlarge: '2.9297rem',
  thirty: '3rem',
  thirtyTwo: '3.2rem',
  '2xlarge': '3.6621rem',
  '3xlarge': '4.5776rem',
  fortyEight: '4.8rem',
  '4xlarge': '5.722rem',
  sixtyFour: '6.4rem'
};

const width = {
  small: '600px',
  medium: '900px',
  large: '1200px',
  extraLarge: '1600px'
};

const arrow = (direction, fill, position, size = 5) => {
  const x1 = size;
  const x2 = size * 2;

  const coords = {
    up: {
      path: `M0 ${x1} L${x2} ${x1} L${x1} 0 Z`,
      viewbox: `0 0 ${x2} ${x1}`
    },
    down: {
      path: `M0 0 L${x1} ${x1} L${x2} 0 Z`,
      viewbox: `0 0 ${x2} ${x1}`
    },
    left: {
      path: `M0 ${x1} L${x1} ${x2} L${x1} 0 Z`,
      viewbox: `0 0 ${x1} ${x2}`
    },
    right: {
      path: `M0 0 L0 ${x2} L${x1} ${x1} Z`,
      viewbox: `0 0 ${x1} ${x2}`
    }
  };

  const data = `
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewbox="${coords[direction].viewbox}">
      <path fill="${fill}" d="${coords[direction].path}" />
    </svg>
  `;

  return `
    background-image: url(data:image/svg+xml;base64,${Buffer.from(data).toString('base64')});
    background-position: ${position};
    background-repeat: no-repeat;
    background-size: ${(['up', 'down'].includes(direction)) ? `${x2}px ${x1}px` : `${x1}px ${x2}px`};
  `;
};

const filterArrow = (direction, stroke, position, size = 5) => {
  const x1 = size;
  const x2 = size * 2;

  const coords = {
    up: {
      path: 'M9 5.5L5 1.5L1 5.5',
      viewbox: `0 0 ${x2} ${x1}`,
      width: '10',
      height: '7'
    },
    down: {
      path: 'M1 1.5L5 5.5L9 1.5',
      viewbox: `0 0 ${x2} ${x1}`,
      width: '10',
      height: '7'
    },
    left: {
      path: 'M1 9L5 5L1 1',
      viewbox: `0 0 ${x1} ${x2}`,
      width: '6',
      height: '10'
    },
    right: {
      path: 'M5 1L1 5L5 9',
      viewbox: `0 0 ${x1} ${x2}`,
      width: '6',
      height: '10'
    }
  };

  const data = `
    <svg width="${coords[direction].width}" height="${coords[direction].height}" viewbox="${coords[direction].viewbox}" fill="none"  version='1.1' xmlns="http://www.w3.org/2000/svg">
      <path d="${coords[direction].path}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return `
    background-image: url(data:image/svg+xml;base64,${Buffer.from(data).toString('base64')});
    background-position: ${position};
    background-repeat: no-repeat;
    background-size: ${(['up', 'down'].includes(direction)) ? `${x2}px ${x1}px` : `${x1}px ${x2}px`};
  `;
};

const close = (fill, position, size = 5) => {
  const data = `
    <svg style="width:auto" xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox="-3 -3 56 56">
      <line stroke="${fill}" stroke-width="7" x1="0" y1="50" x2="50" y2="0"/>
      <line stroke="${fill}" stroke-width="7" x1="0" y1="0" x2="50" y2="50"/>
    </svg>
  `;

  return `
    background-image: url(data:image/svg+xml;base64,${Buffer.from(data).toString('base64')});
    background-position: ${position};
    background-repeat: no-repeat;
    background-size: ${size}px ${size}px;
  `;
};

const search = (fill, position, size = 5) => {
  const data = `
    <svg style="width:auto" xmlns="http://www.w3.org/2000/svg" viewBox="5 5 100 100">
      <circle cx="45" cy="45" r="35" stroke="${fill}" stroke-width="10" fill="transparent" />
      <line stroke="${fill}" stroke-width="10" x1="70" y1="70" x2="100" y2="100" stroke-linecap="round" />
    </svg>
  `;

  return `
    background-image: url(data:image/svg+xml;base64,${Buffer.from(data).toString('base64')});
    background-position: ${position};
    background-repeat: no-repeat;
    background-size: ${size}px ${size}px;
  `;
};

const loader = (size = 3, clr = color.brand) => `
  ::after {
    animation: spin .5s infinite linear;
    border: 0.25rem solid ${clr};
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    height: ${size}rem;
    left: calc(50% - (${size}rem / 2));
    position: absolute;
    top: calc(50% - (${size}rem / 2));
    width: ${size}rem;

    @keyframes spin {
      from { transform: rotate(0) }
      to { transform: rotate(359deg) }
    }
  }
`;

const GlobalTheme = {
  animation,
  animations,
  filterArrow,
  arrow,
  badges,
  breakpoint,
  close,
  color,
  constants,
  font,
  layers,
  loader,
  modularScale,
  search,
  width
};

export default GlobalTheme;
