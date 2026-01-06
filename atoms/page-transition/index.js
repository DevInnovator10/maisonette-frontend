import React from 'react';
import { PageTransition as NextPageTransition } from 'next-page-transitions';

const PageTransition = (props) => (
  <NextPageTransition
    classNames="page-transition"
    loadingClassNames="loading-indicator"
    loadingDelay={500}
    loadingTimeout={{ enter: 400, exit: 0 }}
    skipInitialTransition
    timeout={300}
    {...props}
  />
);

export default PageTransition;
