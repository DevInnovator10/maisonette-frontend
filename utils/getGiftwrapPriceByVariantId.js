const getGiftwrapPriceByVariantId = (variantId, shipments) => {
    const itemShipment = shipments.find((
    (shipment) => shipment.manifest.find((m) => m.variant_id === variantId)));

  return itemShipment?.giftwrap?.giftwrap_price;
};

export default getGiftwrapPriceByVariantId;
