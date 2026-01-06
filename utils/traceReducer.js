export const resourceReducer = (trace, type) => {
  let newTrace = '';
  let filteredTrace;
  switch (type) {
    case 'product':
      return `${trace
        .split('?')[0]
        .split('products')[0]}product`;
    case 'order':
      newTrace = trace
        .split('?')[0]
        .split('/');
      filteredTrace = newTrace.filter((val) => !/M\d{1,20}/.test(val));
      return filteredTrace.join('/');

    case 'shipment':
      newTrace = trace
        .split('?')[0]
        .split('/');
      filteredTrace = newTrace.filter((val) => !/H\d{1,20}/.test(val));
      return filteredTrace.join('/');
    case 'checkouts':
      newTrace = trace
        .split('?')[0]
        .split('/');
      filteredTrace = newTrace.filter((val) => !/M\d{1,20}/.test(val));
      return filteredTrace.join('/');
    default:
      return trace.split('?')[0];
  }
};

export const dataReducer = (trace, type) => {
  switch (type) {
    default:
      return trace;
  }
};
