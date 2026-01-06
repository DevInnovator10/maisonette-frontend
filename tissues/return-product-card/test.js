import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ReturnProductCard from '.';

const item = {
  name: '"Artist" Storage Pillow, Olive/Charcoal',
  brand_slug: 'mimish',
  product_slug: 'artist-storage-pillow-olive-charcoal',
  brand: {
    id: 207,
    parent_id: 3,
    position: 0,
    name: 'Mimish',
    permalink: 'brand/mimish',

    taxonomy_id: 3,
    lft: 280,
    rgt: 281,
    icon_file_name: null,
    icon_content_type: null,
    icon_file_size: null,
    icon_updated_at: null,
    description: null,
    created_at: '2019-12-13T04:39:52.920-05:00',
    updated_at: '2019-12-13T10:08:23.731-05:00',
    meta_title: null,
    meta_description: null,
    meta_keywords: null,
    depth: 1,
    hidden: false,
    highlight: false,
    header_link: false,
    url_override: null,
    add_flair: false,
    track_insights: false
  },
  image: 'https://assets.stg.env.maisonette.com/spree/images/attachments/000/001/782/small/n2xrcuvghnlnvsub5qmj.jpg?1576231355',
  cost: '49.0',
  option_values: [
    {
      type: 'Size',
      value: 'OS'
    }
  ]
};

describe('a order product card', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ReturnProductCard
        brand={{ name: item.brand.name, permalink: `/brands/${item.brand_slug}` }}
        title={{ name: item.name, permalink: `/product/${item.product_slug}` }}
        image={item.image}
        option={item.option_values[0].value}
        optionType={item.option_values[0].type}
        price={item.cost}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
