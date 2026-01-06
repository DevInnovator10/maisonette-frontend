const isURL = (url) => new RegExp('^(?:[a-z+]+:)?//', 'i').test(url);

export default isURL;
