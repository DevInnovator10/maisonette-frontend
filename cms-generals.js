const Sentry = require('@sentry/node');

const getMobileNavigation = (generals) => {
  /* TODO: Create a recursive function which will find the Title property of the
   * Nav = "Global Mobile Navigation" or similar, then store the lookup keys
   * in an array so that the nested properties don't have to be static
  */
  try {
    if (Array.isArray(generals)) return generals[0].Navigation.Content.nav;
    return generals.Navigation.Content.nav;
  } catch (error) {
    return [];
  }
};

const getPromoContent = (generals) => {
  try {
    if (Array.isArray(generals)) return generals[0].Promos.Content.items;
    return generals.Promos.Content.items;
  } catch (error) {
    return [];
  }
};

module.exports = async () => {
  let generals = null;
  let mobileNavigation = false;
  let promoContent = false;

  try {
    generals = await global.fetch(`${process.env.CMS_HOST}/generals`).then((res) => res.json());
    mobileNavigation = getMobileNavigation(generals);
    promoContent = getPromoContent(generals);
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setLevel(Sentry.Severity.Fatal);

      scope.setExtra('Generals Response', generals);

      Sentry.captureMessage('Error generating CMS generals at build time');
    });
  }

  return {
    code: `module.exports = {
      generals: ${JSON.stringify(generals)},
      navigation: ${JSON.stringify(mobileNavigation)},
      promotions: ${JSON.stringify(promoContent)},
      getMobileNavigation: ${getMobileNavigation},

      getPromoContent: ${getPromoContent}
    }`
  };
};
