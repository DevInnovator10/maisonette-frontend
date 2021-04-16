const tracer = require('dd-trace').init({
  service: 'maisonette-frontend',
  // To guarantee test span delivery
  flushInterval: 300000
});

tracer.use('fs', false);

module.exports = require('jest-environment-jsdom');
