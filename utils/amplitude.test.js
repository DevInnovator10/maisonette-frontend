import * as AmplitudeExports from './amplitude';
import * as AmplitudeHelpers from './amplitudeHelpers/splitTestHelpers/index';
import Amplitude, { handleSplitTests, setUserSplitTests, setFirstPurchaseAmplitude } from './amplitude';

const setUserSplitTestsSpy = jest.spyOn(AmplitudeExports, 'setUserSplitTests');
const combineSplitTestsSpy = jest.spyOn(AmplitudeHelpers, 'combineSplitTests');
const setUserPropertiesSpy = jest.spyOn(Amplitude, 'setUserProperties');

describe('setFirstPurchaseAmplitude', () => {
    afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setUserProperties with correct argument when true', () => {
    const first_order = true;
    setFirstPurchaseAmplitude({ first_order });
    expect(setUserPropertiesSpy).toHaveBeenCalledTimes(1);
    expect(setUserPropertiesSpy).toHaveBeenLastCalledWith({ 'first purchase': true });
  });

  it('calls setUserProperties with correct argument when false', () => {
    const first_order = false;
    setFirstPurchaseAmplitude({ first_order });
    expect(setUserPropertiesSpy).toHaveBeenCalledTimes(1);
    expect(setUserPropertiesSpy).toHaveBeenLastCalledWith({ 'first purchase': false });
  });
});

describe('handleSplitTests with no split test cookie value', () => {
  let newSplitTests;

  beforeEach(() => {
    newSplitTests = {};
    global.document.cookie = 'maisonette_split_tests=; path=/;';
    jest.clearAllMocks();
  });

  it('does not call combineSplitTests', () => {
    newSplitTests = { 'VWO-33': '+Control', 'VWO-45': '+Variation-1', 'ALG-41111': '+variant:5' };
    handleSplitTests({ newSplitTests });
    expect(combineSplitTestsSpy).toHaveBeenCalledTimes(0);
  });

  it('does not call setUserSplitTests when there are no active tests', () => {
    newSplitTests = {};
    handleSplitTests({ newSplitTests });
    expect(setUserSplitTestsSpy).toHaveBeenCalledTimes(0);
  });

  it('does not call setUserSplitTests when there are no new active tests', () => {
    handleSplitTests({ newSplitTests });
    expect(setUserSplitTestsSpy).toHaveBeenCalledTimes(0);
  });
});

describe('handleSplitTests with split test cookie value', () => {
  let newSplitTests;

  beforeEach(() => {
    newSplitTests = {};
    global.document.cookie = 'maisonette_split_tests={"VWO-33":"+Control","VWO-45":"+Variation-2","ALG-41111":"+variant:5"}; path=/;';
    jest.clearAllMocks();
  });

  it('calls combineSplitTests', () => {
    newSplitTests = { 'VWO-33': '+Control', 'VWO-45': '+Variation-1', 'ALG-41111': '+variant:5' };
    handleSplitTests({ newSplitTests });
    expect(combineSplitTestsSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call setUserSplitTests when there are no new tests', () => {
    newSplitTests = { 'VWO-33': '+Control', 'VWO-45': '+Variation-1', 'ALG-41111': '+variant:5' };
    handleSplitTests({ newSplitTests });

    expect(setUserSplitTestsSpy).toHaveBeenCalledTimes(0);
  });
});

describe('handleSplitTests on user change', () => {
  beforeEach(() => {
    global.document.cookie = 'maisonette_split_tests={"VWO-33":"+Control","VWO-45":"+Variation-2","ALG-41111":"+variant:5"}; path=/;';
    jest.clearAllMocks();
  });

  it('calls setUserSplitTests when there are active tests', () => {
    handleSplitTests({ userChanged: true });
    expect(setUserSplitTestsSpy).toHaveBeenCalledTimes(0);
  });
});

describe('setUserSplitTests', () => {
  let splitTests;

  beforeEach(() => {
    splitTests = {};
    global.document.cookie = 'maisonette_split_tests=; path=/;';
    jest.clearAllMocks();
  });

  it('sets cookie with proper values', () => {
    splitTests = { 'VWO-23': '+Control', 'VWO-43': '+Variation-3', 'ALG-41311': '+variant:5' };
    setUserSplitTests(splitTests);
    const { cookie } = global.document;
    expect(cookie).toBe('maisonette_split_tests={"VWO-23":"+Control","VWO-43":"+Variation-3","ALG-41311":"+variant:5"}');
  });

  it('calls setUserProperties with proper argument', () => {
    splitTests = { 'VWO-13': '+Control', 'VWO-63': '+Variation-5', 'ALG-41361': '+variant:5' };
    const arg = { 'split tests': ['VWO-13+Control', 'VWO-63+Variation-5', 'ALG-41361+variant:5'] };
    setUserSplitTests(splitTests);
    expect(setUserPropertiesSpy).toHaveBeenCalledWith(arg);
  });
});
