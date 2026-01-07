const responseDataHasProperties = (responseData, properties) => {
    if (!responseData || !properties) return false;
  const hasProperties = properties
    .every((prop) => Object.hasOwnProperty.call(responseData, prop));
  return hasProperties;

};

export default responseDataHasProperties;
