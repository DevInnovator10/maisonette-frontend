const getPromoMessages = (advertisedPromotions) => {
  const advertisedPromos = advertisedPromotions ?? [];

  if (!advertisedPromos.length) return advertisedPromos;

  const timestamp = Date.now();
  // check for starts_at and expires_at - if they are not present, the promotion
  // is meant to start immediately and never expire.
  // check against dates, if present.
  const startsAtCheck = (promoObject) =>
    !promoObject.starts_at || timestamp > Date.parse(promoObject?.starts_at);
  const expiresAtCheck = (promoObject) =>
    !promoObject.expires_at || timestamp < Date.parse(promoObject?.expires_at);

  const activePromos = advertisedPromos?.filter((promoObject) =>
    startsAtCheck(promoObject) && expiresAtCheck(promoObject)
  );
  return activePromos;
};

export default getPromoMessages;
