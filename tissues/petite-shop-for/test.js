import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';

import PetiteShopFor from '.';

const mockStore = configureMockStore();
const store = mockStore({
  profile: {
    email: 'email@email.com'
  },
  petites: {
    loading: false,
    active_mini: 39,
    minis: [
      {
        id: 395,
        user_id: 40,
        name: 'Baby Pam',
        birth_year: 2020,
        birth_month: 9,
        birth_day: 12,
        gender_boy: true,
        gender_girl: true,
        gender_taxons: [
          {
            id: 1285,
            name: 'Unisex',
            permalink: 'gender/unisex'
          },
          {
            id: 1252,
            name: 'Baby Girl',
            permalink: 'gender/baby-girl'
          },
          {
            id: 1284,
            name: 'Baby Boy',
            permalink: 'gender/baby-boy'
          },
          {
            id: 1222,
            name: 'Boy',
            permalink: 'gender/boy'
          },
          {
            id: 1187,
            name: 'Girl',
            permalink: 'gender/girl'
          }
        ],
        age_range_taxons: [
          {
            id: 1194,
            name: '0-6m',
            permalink: 'age-range/0-6m'
          }
        ]
      },
      {
        id: 39,
        user_id: 40,
        name: 'Baby Dan',
        birth_year: 2020,
        birth_month: 7,
        birth_day: 7,
        gender_boy: true,
        gender_girl: false,
        gender_taxons: [
          {
            id: 1285,
            name: 'Unisex',
            permalink: 'gender/unisex'
          },
          {
            id: 1284,
            name: 'Baby Boy',
            permalink: 'gender/baby-boy'
          },
          {
            id: 1222,
            name: 'Boy',
            permalink: 'gender/boy'
          }
        ],
        age_range_taxons: [
          {
            id: 1194,
            name: '0-6m',
            permalink: 'age-range/0-6m'
          }
        ]
      }
    ]
  }
});

let componentWrapper;

describe('a petite shop for', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <PetiteShopFor />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders heading with the correct mini and styles', () => {
    const shopFor = componentWrapper.getByText('Shop For');
    expect(shopFor.tagName).toBe('H2');
    expect(shopFor).toHaveStyle('color: #3150A2');

    const babyDan = componentWrapper.getByText('Baby Dan');
    expect(babyDan.tagName).toBe('SPAN');
    expect(babyDan).toHaveStyle('color: #C84D19');
  });

  it('renders gender with the correct gender and styles', () => {
    const gender = componentWrapper.getByText('Gender: Boy');
    expect(gender.tagName).toBe('LI');
    expect(gender).toHaveStyle('color: #3150A2');
    expect(gender).toHaveStyle('line-height: 2rem');
  });

  it('renders age range with the correct age range and styles', () => {
    const ageRange = componentWrapper.getByText('Age Range: 0-6m');
    expect(ageRange.tagName).toBe('LI');
    expect(ageRange).toHaveStyle('color: #3150A2');
    expect(ageRange).toHaveStyle('line-height: 2rem');
  });
});
