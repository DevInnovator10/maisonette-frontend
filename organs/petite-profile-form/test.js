import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import PetiteForm from '.';

const mockStore = configureMockStore();
const store = mockStore({
  petites: {
    active_mini: -1,
    loading: false,
    minis: [
      {
        id: 1906,
        name: 'eric',
        birth_year: 2018,
        birth_month: 12,
        birth_day: 23,
        gender_boy: true,
        gender_girl: true,
        gender_taxons: [
          {
            id: 840,
            name: 'Baby Girl'
          },
          {
            id: 833,
            name: 'Baby Boy'
          },
          {
            id: 140,
            name: 'Boy'
          },
          {
            id: 137,
            name: 'Girl'
          }
        ],
        age_range_taxons: [
          {
            id: 970,
            name: '6-12m'
          },
          {
            id: 969,
            name: '0-6m'
          }
        ],
        baby: true
      },
      {
        id: 1907,
        name: 'girl',
        birth_year: 2018,
        birth_month: 12,
        birth_day: 23,
        gender_boy: false,
        gender_girl: true,
        gender_taxons: [
          {
            id: 840,
            name: 'Baby Girl'
          },
          {
            id: 137,
            name: 'Girl'
          }
        ],
        age_range_taxons: [
          {
            id: 970,
            name: '6-12m'
          },
          {
            id: 969,
            name: '0-6m'
          }
        ],
        baby: true
      }
    ]
  }
});

describe('the petite profile form', () => {
  const RealDate = Date;

  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate('2020-03-13');
      }
    };

    componentWrapper = render(
      <Provider store={store}>
        <PetiteForm token="" profile={{}} updateMinis={() => {}} />
      </Provider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('loads the right amount of minis', () => {
    const petites = componentElement.querySelectorAll('fieldset');
    expect(petites.length).toEqual(2);
  });

  it('has "add another profile" button', () => {
    const button = componentWrapper.getByText('Add Another Profile');
    expect(button).toBeDefined();
  });

  it('submit button is disabled by default', () => {
    const button = componentWrapper.getByText('Save');
    expect(button.disabled).toEqual(true);
  });
});
