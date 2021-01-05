// TODO: opportunity to move this into CMS? and make it more dynamic?
// TODO: refactor eventually
/*
    this is a hardcoded list of
  promotions & their dates.
  the `salePromotion` key is the key used in `salePromotions.json
  to render the appropriate header information.
*/
export const promotionDates = [
  {
    salePromotion: 'labor-day-extra-sale-2022',
    edits_slug: {
      'labor-day-sale-on-sale': true
    },
    start: '28 Aug 2022 00:23:00 GMT',
    end: '06 Sep 2022 00:08:00 GMT'
  },
  {
    salePromotion: 'pre-holiday-sale-2022',
    edits_slug: {
      'pre-holiday-sale': true,
      'pre-holiday-sale-extra10': true
    },
    start: '01 Nov 2022 16:00:00 GMT',
    end: '08 Nov 2022 08:00:00 GMT'
  },
  {
    salePromotion: 'last-minute-holiday-gift-sale-2022',
    edits_slug: {
      'last-minute-holiday-gift-sale': true,
      'last-minute-holiday-gift-sale-extra15': true
    },
    start: '04 Dec 2022 16:00:00 GMT',
    end: '11 Dec 2022 08:00:00 GMT'
  }
];

const checkRunningPromotion = (currentDateTime) => {
/*
  checks if there is a current promotion running.
  if true, then the key associated with the promotion data
  for the salePromotions JSON object is returned.
  else, false is returned
*/
  const currentPromotion = promotionDates.find((promo) =>
    currentDateTime > Date.parse(promo.start)
    && currentDateTime < Date.parse(promo.end));

  return currentPromotion ?? false;
};

export default checkRunningPromotion;
