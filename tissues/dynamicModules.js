import dynamic from 'next/dynamic';

const modules = {
  about: dynamic(() => import('./about')),
  accordion: dynamic(() => import('./accordion')),
  banner_row: dynamic(() => import('./banner-row')),
  block_quote: dynamic(() => import('./block-quote')),
  category_taxon_shop: dynamic(() => import('./category-taxon-shop')),
  circle_banner: dynamic(() => import('./circle-banner')),
  color_story: dynamic(() => import('./color-story')),
  double_banner: dynamic(() => import('./double-banner')),
  dynamic_info: dynamic(() => import('./dynamic-info')),
  gift_finder: dynamic(() => import('./gift-finder')),
  heading_subhead: dynamic(() => import('./heading-subhead')),
  heading: dynamic(() => import('./heading')),
  hero: dynamic(() => import('./hero')),
  image_banner: dynamic(() => import('./image-banner')),
  image_shoppable: dynamic(() => import('./image-shoppable')),
  le_scoop: dynamic(() => import('./le-scoop')),
  markup: dynamic(() => import('./markup')),
  more_stories: dynamic(() => import('./more-stories')),
  newsletter: dynamic(() => import('./newsletter')),
  paragraph: dynamic(() => import('./paragraph')),
  privacy: dynamic(() => import('./privacy')),
  product_text: dynamic(() => import('./product-text')),
  product: dynamic(() => import('./product')),
  promo_banner: dynamic(() => import('./promo-banner')),
  rich_text_image: dynamic(() => import('./rich-text-image')),
  social_share: dynamic(() => import('./social-share')),
  story_module: dynamic(() => import('./story-module')),
  story_place: dynamic(() => import('./story-place')),

  taxon_products: dynamic(() => import('./taxon-products')),
  three_ways: dynamic(() => import('./three-ways')),
  two_image: dynamic(() => import('./two-image')),
  video: dynamic(() => import('./video'))
};

export default modules;
