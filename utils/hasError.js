// check to see if response has either error or errors as a prop
const hasError = (res = {}) => !!(
    (res.error || (res.errors && Array.isArray(res.errors) && res.errors.length > 0))
);

export default hasError;
