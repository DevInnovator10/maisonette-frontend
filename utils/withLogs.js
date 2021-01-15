import { Performance } from './logger';

const middleware = (resolver) => async (req, res) => {
  const isValidEnv = ['ppd', 'prd', 'qa', 'stg']
    .some((env) => env === process.env.NEXT_PUBLIC_SENTRY_ENV);

  // Skip performance monitoring if not in a valid environment
  if (!isValidEnv) {
    // Await the resolver to ensure the request is handled
    await resolver(req, res);
    // Exit the middleware
  } else {
    // Attempt a performance audit
    try {
      // Create an instance of the Performance wrapper
      // TODO: Create a new signature with [req,res] params
      const performance = new Performance();

      // Our wrapper includes handling timings
      performance.start();

      // Await the resolver to ensure the request is handled
      const response = await resolver(req, res);

      // Stop the timer
      performance.end();

      // Log the performance audit
      performance.report(response);
    } catch (error) {
      // Log errors with performance auditing
      console.error(error);
      // TODO: Should we throw the error here?
    }
  }

  // Return the response
  res.end();
};

export default middleware;
