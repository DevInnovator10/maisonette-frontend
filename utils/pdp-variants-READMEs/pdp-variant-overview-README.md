# Overview

Previously, if a product had different color variations, each color variation was distinguished as its own product with its own size variants.

With the PDP Variants Epic, we are now combining all color variations into 1 product. So now a product's variants are inclusive of all color and size variants.

1. [Changes in API Response](#changes-in-api-response)
2. [Color Variants Strategy](#color-variants-strategy)
3. [Logic Changes Overview](#logic-changes)
    * [Storing Grouped Colors in Product Context](#storing-grouped-colors-in-product-context)
    * [PDP Color Options](#pdp-color-options)
    * [Sticky Mobile Reset After Color Changes](#sticky-mobile-reset-after-color-changes)
    * [Add To Cart Reset After Color Changes](#add-to-cart-reset-after-color-changes)
    * [Dynamic Meta Data and HTML Script](#dynamic-meta-data-and-html-script)
    * [Product Image Carousel](#product-image-carousel)
    * [Dynamic Pricing in Product Header](#dynamic-pricing-in-product-header)
    * [Dynamic Product Properties](#dynamic-product-properties)

<br>
<br>
<br>

# Changes in API Response
I will be referring to the properties in these two JSON responses

- [original.json](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/original.json) as the original PDP response
- [new_pdp_view.json](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/new_pdp_view.json) as the new PDP response

## Updates to Existing Properties:

1. `name` will no longer include the color of the product
2. `slug` will no longer include the color of the product
3. `trends` are determined on product level for now.
    - This means a trend will only be applicable to a product if all color variants suffice. I.e) if `anna-dress-blue` is `On Sale` but `anna-dress-red` is not, then `On Sale` will ***not*** be in the `trends` array.

## New Properties:
1. `maisonette_variant_group_attributes` is an array that contains the `master` data for each color variant. The breakdown of each element in this array:
    -  `description` and `images` are used to dynamically update the html script in [`createNewScript()`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L273-L275) according to the selected color
    - `product_properties` are used to update the `ProductProperties`/`ProductPropertiesRevamp` accordingly
    - `total_on_hand` will display the total count of products of a color
    - `variant_ids` will be an array of all IDs of each size variant of a color
2. `new_slug`, `option_type_name`, `option_value_name` are new properties per [TEC-4460](https://maisonette.atlassian.net/browse/TEC-4)
     - In the situation that the user visit an old URL that uses the old slug (that includes the color) of a product, the backend will include these new properties. The frontend will use the `new_slug` to redirect the user to the new URL

<br>
<br>
<br>

# Color Variants Strategy

Both original and new PDP designs are subscribed to the [`Product Context`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/utils/context/product-provider.js).

The major difference between the 2 API responses is that all color and size variants exist in the [new API response](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/new_pdp_view.json#L878-L3277);

The existing logic on PDP (`ProductAddToCart`) only handles the different sizes, quantity, product descriptions, lead times, sales, prices of a single color. There may be discrepancies between color variants. I.e) a blue dress may have 3 sizes while a red dress may only have 2.

To avoid refactoring majority of the PDP logic and to handle the discrepancies between colors, the following [Context properties](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/utils/context/product-provider.js#L166-L168) were made to feed the existing logic with the data of different colors as a user browses through the color options.
  - `colorVariants` is an object whose keys are the color names and values are arrays of the corresponding size variants of each color.
    > `{ lime: [{size S variant}, {size M variant}], mint: [{size XS variant}] }`
  - `activeColorVariants` is an array that contains all size variants of the current selected color. Most PDP components are subscribed to this property to render the necessary details of that particular color variant.
  - `activeColor` is a string that represents the current color selected

As the user browses through different color options via [`ProductColorOptions`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-options-color-variant/index.js#L195-L196), `activeColor` is updated in Context and is used to search `colorVariants` to set `activeColorVariants` to the correct size variants of the `activeColor`

In addition to adding color options to the PDP, we also append a query param to the URL `/?color=lime`, which changes as the user browses through colors. This query param is used to select the first color to display if the user is directly navigated to PDP. Otherwise, if the query param is not specified, then a default color is selected. This logic can be found in [`ProductDetails`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-details/index.js#L141-L160) and [`ProductDetailsRevamp`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/adee3d6ee240e3afe8dc2dac91b2dd3dd4d0961f/organs/pdp-revamp/pdp-details-new.js#L139-L158)


<br>
<br>
<br>

# LOGIC CHANGES

The remainder of this README will breakdown the major logic changes made in the code.

Please note that because PDP variants is rolling out with PDP revamp, you will see duplicated logic in the original and new PDP components.

  1. [Storing Grouped Colors in Product Context](#storing-grouped-colors-in-product-context)
  2. [PDP Color Options](#pdp-color-options)
  3. [Sticky Mobile Reset After Color Changes](#sticky-mobile-reset-after-color-changes)
  4. [Add To Cart Reset After Color Changes](#add-to-cart-reset-after-color-changes)
  5. [Dynamic Meta Data and HTML Script](#dynamic-meta-data-and-html-script)
  6. [Product Image Carousel](#product-image-carousel)
  7. [Dynamic Pricing in Product Header](#dynamic-pricing-in-product-header)
  8. [Dynamic Product Properties](#dynamic-product-properties)

<br>
<br>
<br>

# Storing Grouped Colors in Product Context

Because all color and size variants are under `variants` in the [new API response](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/new_pdp_view.json), we need to separate the colors and group each color's size variants. If the user lands on a canonical URL, we will select a default color to display.
This change occurs in:
  * `ProductDetails` [(`organs/pdp-details`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-details/index.js)
  * `ProductDetailsRevamp` [(`organs/pdp-revamp/pdp-details-new`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-details-new.js)

## Major changes

### 1. Methods:
  * `groupColors()`
      - returns an object: `{ color: [{size variant}, {size variant}], color2: [{size variant}] }`
      - this method is only called at initial render. It parses through the product's variants and groups each color with its size variants

  * `currentColorPrices()`
      - returns an array of the corresponding prices for the selected color
      - if no color is selected, then the product's entire price range is returned
      - the returned array is used to render the product's pricing on the Product Details Header

  * `noCurrentColorOffers()`
      - returns a boolean
      - this method parses through the selected color's size variants to identify if there are any offers on the product
      - if no color is selected, then the entire product's variants are parsed

  * `hasVariants()` - `ProductDetailsRevamp` only
      - returns a boolean
      - this method is used to determine where to render the new `ProductRestrictionsRevamp`. If a product does not have any variants, then product restrictions render in the `ProductHeaderRevamp`. Otherwise, the restrictions render after a size has been selected in `ProductAddToCartRevamp`.

  * `isFinalSale()` - `ProductDetailsRevamp` only
    - returns a boolean
    - this method is used to determine if `ProductServiceLevel` displays the [Free Returns Service Callout](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-service-level.js#L60-L69) for the color variant

### 2. Local State
  * `groupedColors` - an object of the grouped colors and their size variants

### 3. Default color selected on initial render
  * This `useEffect` is only invoked once as `groupedColors` is determined on initial render.
  * Not on Quickshop:
      - `setColorVariants()` is used to store the `groupedColors` in the Product Context
      - If the user is on PDP and not Quickshop, then the URL is checked to see if a query param exists. This is to handle if the user directly landed on PDP with a link for a specific color variant. If there is a color query param, then we will validate if the query param is an existing color variant before `setActiveColor()` and `setActiveColorVariants()` to update the Product Context.
      - Otherwise, if the query param is an invalid color or non-existent, then we will iterate over the `groupedColors` object to find the first color that is in stock and set this color as the default color. We will also append this default color as a query param to the url. This is to handle if the user navigated to PDP from PLP (no Quickshop)
  * On first render of Quickshop:
      - If the user is on the PLP, the `activeColor` was already set on PLP level. We will only need to `setActiveColorVariants()` using the `activeColor`.
      - this is subject to change once Algolia indices are migrated to the new products

<br>
<br>
<br>

# PDP Color Options

`ProductColorOptions` [(`molecules/product-options-color-variant`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-options-color-variant/index.js) is the component that is rendered on the original and new PDP design.

## Major Changes
  * [`sortedColorImages()`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-options-color-variant/index.js#L137-L152)
    - returns an array
    - this method parses through `colorVariants` and creates an object for each color. The object consists of the color's name, image url, and out-of-stock status (if all size variants are out of stock). Any out of stock colors will be moved to the end of the array.

  * Local State - `colorOutOfStock`
    - `colorOutOfStock` is used to render [text next to the color](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-options-color-variant/index.js#L169)

  * [When a color option is clicked](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-options-color-variant/index.js#L193-L202)
    - any warning messages are cleared out
    - `activeColor` and `activeColorVariants` are updated in Product Context to the selected color and corresponding size variants.
    - `colorOutOfStock` is updated accordingly
    - If the user is browsing on PDP, then the URL is updated with the correct query param



<br>
<br>
<br>

# Sticky Mobile Reset After Color Changes

Sticky Mobile only handles size variants. Therefore, as the color changes, any of these previous selections/actions need to be reset:
  - all size variants
  - any size selection
  - any warning messages
  - any filled out monogram fields

This change only occurs in `StickyProductAdd` [(`tissues/product-details-sticky-add-to-cart`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-sticky-add-to-cart/index.js).

## Major changes

  * [UseEffect for `activeColorVariants`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-sticky-add-to-cart/index.js#L325-L335)
      - all local states are reset if the user switches colors


<br>
<br>
<br>

# Add To Cart Reset After Color Changes

As the color changes, any of these previous selections/actions/local state need to be reset:
  - all size variants
  - any size selection
  - quantity selection
  - out-of-stock status
  - any warning messages
  - monogram only status
  - monogram optional status
  - any filled out monogram fields

This change occurs in:
  * `ProductAddToCart` [(`tissues/product-details-add-to-cart`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-add-to-cart/index.js)
  * `ProductAddToCartRevamp` [(`organs/pdp-revamp/pdp-add-to-cart-new`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-add-to-cart-new.js)


## Major changes
  * New methods for easier readability:
    - `handleSingleVariantReset()`
        - if the color variant does not have any sizes or is One Size, set the appropriate selections/local state
    - `handleMultipleVariantsReset()`
        - if the color variant has sizes, set the appropriate selections/local state
    - `handleQuantityReset()`
        - resets the quantity to 1
    - `handleOnOutOfStock()`
        - if the color variant is completely out of stock, set the appropriate selections/local state
    - `handleMonogramFieldsReset()`
        - resets the monogram form fields


  * UseEffect for `activeColorVariants`
    - [ProductAddToCart](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-add-to-cart/index.js#L323-L344)
    - [ProductAddToCartRevamp](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-add-to-cart-new.js#L366-L398)
    - this useEffect resets any selections/local state. If the `activeColorVariants` only has 1 variant, then it updates local state accordingly. It also sets the Out-Of-Stock status.

  * UseEffect for `props.variant`
    - [ProductAddToCart](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-add-to-cart/index.js#L711-L732)
    - [ProductAddToCartRevamp](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-add-to-cart-new.js#L776-L794)
    - if `props.variant` is null, then the user has changed colors. Otherwise, if `props.variant` is truthy, then a size was selected.




<br>
<br>
<br>


# Dynamic Meta Data and HTML Script

As the color changes, we need to update the Meta Data and HTML Script accordingly. This change only occurs in `pages/product/[slug.js]`.

## Major changes

  * Dynamic Meta Data:
      - [`meta`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L240-L259) was originally static. However, as each color variant has its own `image`. Therefore, `meta.og.image` and `meta.twitter.image` need to be dynamically updated.
      - Local state `currentMeta` is [set to the initial `meta`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L304).
      - As the user browses through colors, the [`useEffect`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L316-L339)for `activeColor` is invoked. Once the `activeColor` is validated as a variant within `props.product.maisonette_variant_group_attributes`, then the `newMeta`'s images are updated and `setCurrentMeta` is invoked.

  * Dynamic HTML Script:
      - The [original HTML script](https://github.com/MaisonetteWorld/maisonette-frontend/blob/develop/pages/product/%5Bslug%5D.js#L342-L360) was static. However, `image`, `description`, `price`, and `availability` needed to be dynamic.
      - Local state `currentScript` was created to handle the changes. It is initialized with the generic master product's HTML script, evaluated by `createNewScript()`.
      - [`createNewScript()`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L261-L301) is a method that accepts the color `variantObj` (from `props.product.maisonette_variant_group_attributes`) and the color's `activeColorVariants`. It uses `variantObj` to set the correct image and description. `activeColorVariants` is used to determine the price and availability
      - [`getPrice()`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L218-L238) and [`getAvailability()`](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/pages/product/%5Bslug%5D.js#L210-L216) was refactored to accept an array a parameter. On initial render, both methods receive the `props.product.variants`. Upon color browsing, they receiver the color's `activeColorVariants`.


<br>
<br>
<br>


# Product Image Carousel

As the color changes, we need to update the Product Image Carousel to display the correct color images. This change occurs in:
  * `ProductCarousel` [(`tissues/product-carousel`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-carousel/index.js)
  * `ProductCarouselRevamp` (not built yet)

## Major changes

  * Local State
      - `images` was created to use as the current images to display. This is updated as the user browses through colors.

  * Initial Render - UseEffect
      - if an `activeColor` hasn't been chosen and the `props.image` is an empty array, `images` is set to an array with a generic default image.

  * UseEffect - `activeColor`
      - As the user browses through colors, the `activeColor` is validated and used to find the corresponding images in `props.product.maisonette_variant_group_attributes`

<br>
<br>
<br>

# Dynamic Pricing in Product Header

As the color changes, we need to update the Product Header to display the correct prices. This change occurs in:
  * `ProductHeader` [(`molecules/product-detail-header`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/molecules/product-detail-header/index.js)
  * `ProductHeaderRevamp` [(`organs/pdp-revamp/pdp-header-new`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/organs/pdp-revamp/pdp-header-new.js)

## Major changes

  * UseEffect - `activeColorVariants`
      - As the user browses through colors, display the general pricing options for the selected color


<br>
<br>
<br>


# Dynamic Product Properties

As the color changes, we need to update the Product Properties to display the correct information. This change occurs in:

  * `ProductProperties` [(`tissues/product-details-properties`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-details-properties/index.js) :
    * `Materials` [(`tissues/product-properties-materials`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-materials/index.js)
    * `Details` [(`tissues/product-properties-details`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-details/index.js)
    * `Sizing` [(`tissues/product-properties-sizing`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-sizing/index.js)
    * `KeyIngredients` [(`tissues/product-properties-key-ingredients`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-key-ingredients/index.js)
    * `FullListIngredients` [(`tissues/product-properties-full-ingredients`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-full-ingredients/index.js)
    * `HowToUse` [(`tissues/product-properties-how-to-use`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-how-to-use/index.js)
    * `GoodToKnow` [(`tissues/product-properties-good-to-know`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-good-to-know/index.js)
    * `Awards` [(`tissues/product-properties-awards`)](https://github.com/MaisonetteWorld/maisonette-frontend/blob/TEC-4719/story/option-type/tissues/product-properties-awards/index.js)

  * There will be a `ProductPropertiesRevamp` for PDP revamp.

## Major changes
The same general strategy was used for all the properties:

  * UseEffect for `activeColor` and `props.variant`
      - As the user browses through colors, the `activeColor` is validated as a variant (`validColor`) within `props.product.maisonette_variant_group_attributes`. Then `validColor.product_properties` is used to render the correct data for the color variant.
      - If `activeColor` is not a valid color, then the general `props.product.product_properties` is rendered.