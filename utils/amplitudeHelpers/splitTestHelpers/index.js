// creates array out of combined split test object to set as 'split tests' user property
export const formatSplitTests = (combinedTests = {}) => {
    const testIds = Object.keys(combinedTests);
  return testIds.map((testId) => `${testId}${combinedTests[testId]}`);
};

// combines supplied split tests by first checking if the new tests are not
// included in the existing tests that are saved in the cookie
export const combineSplitTests = (newTests = {}, existingTestsCookie = '{}') => {
  const existingTestsCookieObj = JSON.parse(existingTestsCookie);
  const newTestIds = Object.keys(newTests);
  const noNetNewTests = newTestIds.length === 0 || newTestIds.every(
    (testId) => newTests[testId] === existingTestsCookieObj[testId]
  );

  // exit if all new test entries match existing test entries
  // this saves us an identify call in Amplitude
  if (noNetNewTests) return false;

  // this folds the tests into one object, which takes care of a user
  // being in a different variation if this cookie is stale by overriding
  // the values
  return { ...existingTestsCookieObj, ...newTests };
};

// get VWO tests from window object and format as an object
// with the test ID in the key and the variant name in the value
// we can have multiple VWO tests running at the same time that can
// also be url dependent
export const getVWOTests = () => {
  const campaignData = global?.window?._vwo_campaignData;
  // campaignData is an empty object if not in a test
  // keys are the campaign ids
  // 'n' property is the variation name
  const campaignIds = Object.keys(campaignData ?? {});
  if (campaignIds.length === 0) return false;

  const formattedVWOTests = {};
  campaignIds.forEach((id) => {
    if (campaignData[id]?.n) formattedVWOTests[`VWO-${id}`] = `+${campaignData[id].n}`;
  });

  return formattedVWOTests;
};

// get Algolia tests from searchResults passed in and format as an object
// with the test ID in the key and the variant ID in the value
// we currently can only have one Algolia test running at a time

export const getAlgoliaABTests = (searchResults) => {
  const testID = searchResults?.abTestID;
  const testVariantID = searchResults?.abTestVariantID;

  if (!testID || !testVariantID) {
    return false;
  }

  const formattedAlgoliaTest = { [`ALG-${testID}`]: `+variant:${testVariantID}` };

  return formattedAlgoliaTest;
};
