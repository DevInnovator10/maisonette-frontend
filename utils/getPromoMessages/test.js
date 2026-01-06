import getPromoMessages from '.';

describe('getPromoMessages()', () => {
  let advertisedPromotions = [];
  let baseAdvertisedPromotion;
  const today = new Date();

  const changeDateBy = (days) => {
    const desiredDate = new Date();
    desiredDate.setDate(today.getDate() + days);
    return desiredDate;
  };

  beforeEach(() => {
    baseAdvertisedPromotion = {
      id: 102343,
      name: '15% off first in-app $95+',
      description: '15% off your first in-app purchase $95+\r\nCode*: YAY15\r\nnow through 10/31 or\r\n10/17 - 10/31 \r\n\r\nPRIMARY MESSAGE TIMEFRAME: 10/16 in email/sms (1 day prior to Soft Holiday Launch)\r\nSECONDARY MESSAGE TIMEFRAME: From 10/17 through 10/31',
      type: null,
      usage_limit: null,
      match_policy: 'all',
      advertise: true,
      path: null,
      advertised_text: 'Additional 5% OFF, 10% OFF $75+, 15% OFF $300+ with BLACKFRIDAY2022 promo',
      advertised_text_short: 'Up to 40% OFF with BLACKFRIDAY2022 promo'
    };
  });

  // returns array of promo objects

  it('returns an array of promo objects if a promo has no start or expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: null,
      starts_at: null
    })];

    expect(getPromoMessages(advertisedPromotions)).toEqual(advertisedPromotions);
  });

  it('returns an array of promo objects if a promo has no start date with a valid expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(7),
      starts_at: null
    })];

    expect(getPromoMessages(advertisedPromotions)).toEqual(advertisedPromotions);
  });

  it('returns an array of promo objects if a promo has a valid start date with no expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: null,
      starts_at: changeDateBy(-10)
    })];
    expect(getPromoMessages(advertisedPromotions)).toEqual(advertisedPromotions);
  });

  it('returns an array of promo objects if a promo has a valid start and expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(7),
      starts_at: changeDateBy(-10)
    })];
    expect(getPromoMessages(advertisedPromotions)).toEqual(advertisedPromotions);
  });

  // returns empty array

  it('returns an empty array if there is an invalid start date and valid expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(7),
      starts_at: changeDateBy(3)
    })];

    expect(getPromoMessages(advertisedPromotions)).toEqual([]);
  });

  it('returns an empty array if there is a valid start date and invalid expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(-1),
      starts_at: changeDateBy(-11)
    })];

    expect(getPromoMessages(advertisedPromotions)).toEqual([]);
  });

  it('returns an empty array if there is an invalid start date and invalid expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(-1),
      starts_at: changeDateBy(1)
    })];

    expect(getPromoMessages(advertisedPromotions)).toEqual([]);
  });

  it('returns an empty array if there is no start date and invalid expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: changeDateBy(-1),
      starts_at: null
    })];
    expect(getPromoMessages(advertisedPromotions)).toEqual([]);
  });

  it('returns an empty array if there is an invalid start date and no expire date', () => {
    advertisedPromotions = [Object.assign(baseAdvertisedPromotion, {
      expires_at: null,
      starts_at: changeDateBy(7)
    })];
    expect(getPromoMessages(advertisedPromotions)).toEqual([]);
  });
});
