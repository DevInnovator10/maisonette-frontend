const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps')();
const withTM = require('next-transpile-modules');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const REDIRECTS = require('./utils/redirects/redirects-01.json');
const REDIRECTS_ARRAY = require('./utils/redirects/redirectsArray.json');

module.exports = withBundleAnalyzer(withSourceMaps(withTM({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },

  ...(process.env.SEO_MODE_ON === 'true' && {
    env: {
      NEXT_PUBLIC_ASSET_HOST: 'https://assets.maisonette.com',
      CMS_HOST: 'https://strapi.maisonette.com',
      NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX: 'products_production',
      NEXT_PUBLIC_ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX: 'products_production_query_suggestions',
      NEXT_PUBLIC_ALGOLIA_CONTENTS_INDEX: 'contents_production',
      NEXT_PUBLIC_ALGOLIA_PRODUCTS_FREQUENTLY_BOUGHT: 'products_production_best_sellers',
      NEXT_PUBLIC_ALGOLIA_PRODUCTS_RECOMMENDED: 'products_production_recommended',
      SOLIDUS_HOST_SEO: 'https://api.maisonette.com'
    }
  }),

  images: {
    domains: [
      'assets.gotdoodle.com',
      'assets.maisonette.com',
      'assets.qa.env.maisonette.com',
      'assets.stg.env.maisonette.com'
    ]
  },
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.DEVELOPMENT !== '1'
    ? process.env.NEXT_PUBLIC_ASSET_HOST
    : '',
  webpack: (config, {
    dev, isServer, webpack
  }) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    );

    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
      // eslint-disable-next-line no-param-reassign
      config.optimization.splitChunks.cacheGroups.formik = {
        chunks: 'all',
        enforce: true,
        minChunks: 1,
        name: 'formik',
        priority: 100,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/](yup|formik)[\\/]/
      };
    }

    if (!dev && !(process.env.NODE_ENV === 'development')) {
      config.plugins.push(
        new SentryWebpackPlugin({
          release: process.env.npm_package_version,
          include: '.next',
          configFile: 'sentry.properties',
          urlPrefix: '/_next/'
        })
      );
    }

    const originalEntry = config.entry;

    // eslint-disable-next-line no-param-reassign
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./utils/polyfills')) {
        entries['main.js'].unshift('./utils/polyfills');
      }

      return entries;
    };

    config.plugins.push(new webpack.IgnorePlugin(/test/));
    config.plugins.push(new webpack.IgnorePlugin(/test.js/));
    config.plugins.push(new webpack.IgnorePlugin(/__snapshots__/));
    // eslint-disable-next-line new-parens
    config.plugins.push(new LodashModuleReplacementPlugin);

    // eslint-disable-next-line no-param-reassign
    config.node = {
      __filename: true
    };

    config.module.rules.push(
      {
        test: require.resolve('./navigation.js'),
        use: [{ loader: 'val-loader' }]
      },
      {
        test: require.resolve('./cms-generals.js'),
        use: [{ loader: 'val-loader' }]
      }
    );

    return config;
  },
  webpackDevMiddleware: (config) => config,
  transpileModules: ['public-ip'],
  poweredByHeader: false,
  async redirects() {
    // TODO: consolidate these redirect files or create in the CMS
    // REDIRECTS is an object that is used to piece together
    // redirect objects with source, destination and permanent keys.
    // REDIRECTS_ARRAY is an array consisting of hardcoded redirect objects
    const keys = Object.keys(REDIRECTS);
    const redirectsArray = [...REDIRECTS_ARRAY];

    keys.forEach((key) => {
      redirectsArray.push({
        source: key,
        destination: REDIRECTS[key],
        permanent: true
      });
    });

    return redirectsArray;
  },
  async headers() {
    return [

      {
        source: '/product/:slug',
        headers: [
          {
            // Cache and serve cached PDPs for 60 seconds.
            // After 60 seconds serve cached PDPs for up to another 60 seconds
            // until it is refreshed in the background.
            // If the origin servers are down serve stale content for up to 1 day.
            key: 'Cache-Control',
            value: 'max-age=60, stale-while-revalidate=60, stale-if-error=86400'
          }
        ]
      }
    ];
  }
})));
