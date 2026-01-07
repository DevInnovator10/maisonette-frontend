import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const ImageWithFallback = (props) => {
    const { src, fallback, ...rest } = props;
  const [img, set] = useState(src);

  const handleOnImageError = () => set(fallback);

  return (
    <Image
      {...rest}
      src={img}
      onError={handleOnImageError}
    />
  );
};

ImageWithFallback.defaultProps = {
  fallback: '/images/default-image.jpg',
  src: '/images/default-image.jpg'
};

ImageWithFallback.propTypes = {
  fallback: PropTypes.string,
  src: PropTypes.string
};

export default ImageWithFallback;
