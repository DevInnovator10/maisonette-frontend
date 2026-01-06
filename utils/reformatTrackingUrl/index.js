const reformatTrackingUrl = (originalTrackingUrl, trackingNumber) => {
  const url = originalTrackingUrl.replace(/tracking_numbers=.*/, `tracking_numbers=${trackingNumber}`);
  return url;
};

export default reformatTrackingUrl;
