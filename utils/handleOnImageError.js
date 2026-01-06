import * as Sentry from '@sentry/browser';

// eslint-disable-next-line consistent-return
const handleOnImageError = (e) => {
  // this method attempts to switch out the image's source with a default image
  // mainly used for product images.
  const img = e.target;
  const defaultImage = `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`;
  // create generic error for Sentry, since we have no way of knowing
  // the actual error
  const error = new Error('Image error');

  // send img specific info to Sentry
  Sentry.withScope((scope) => {
    scope.setLevel(Sentry.Severity.Warning);
    scope.setFingerprint(['{{default}}', 'handleOnImageError']);
    scope.setContext('Image', { url: img?.src, alt: img?.alt });
    scope.setTag('ImageError.url', img?.src);
    Sentry.captureException(error);
  });

  // do not switch to the default image url again if we already tried it,
  // which will prevent this from being called continuously when there is an error
  // with the default image
  if (img.src !== defaultImage) {
    img.src = defaultImage;
  } else {
    return false;
  }
};

export default handleOnImageError;
