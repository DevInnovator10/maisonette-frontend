import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import PetiteDropdownList from '.';

let wrapper;
let elem;
let handleClick;

const petites = {
  loading: false,
  minis: [
    {
      id: 1,
      user_id: 23,
      name: 'Eric Jr.',
      birth_year: 2019,
      birth_month: 1,
      birth_day: null,
      gender_boy: true,
      gender_girl: false
    },
    {
      id: 2,
      user_id: 23,
      name: 'Jake Jr.',
      birth_year: 2019,
      birth_month: 1,
      birth_day: null,
      gender_boy: true,
      gender_girl: false
    }
  ],
  count: 2,
  total_count: 2,
  current_page: 1,
  pages: 1,
  per_page: 25,
  active_mini: 2
};

describe('petite profiles dropdown default', () => {
  beforeEach(() => {
    wrapper = render(
      <PetiteDropdownList
        activeMini={-1}
        handleOnMiniClick={() => {}}
        petites={{}}
        loading={petites.loading}
      />
    );
    elem = wrapper.container;
  });
  it('should render the molecule', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should render default text if there are no minis', () => {
    const defaultListItem = wrapper.queryAllByText('Create your minis’ profile for custom recommendations');
    expect(defaultListItem[0]).toBeInTheDocument();
    expect(defaultListItem[0]).toHaveStyle('margin-bottom: 3rem');
    expect(defaultListItem[0]).toHaveStyle('text-align: center');
  });
  it('should have correct styles', () => {
    elem.querySelectorAll('li').forEach((listitem) => {
      const styles = global.window.getComputedStyle(listitem);
      expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
      expect(listitem).toHaveStyle('color: #FFFFFF');
      expect(listitem).toHaveStyle('font-size: 2.3438rem');
      expect(listitem).toHaveStyle('line-height: 1');
      expect(listitem).toHaveStyle('padding: 5px 0');
      expect(listitem).toHaveStyle('text-align: center');
    });
  });
});

describe('petite profiles dropdown items', () => {
  beforeEach(() => {
    handleClick = jest.fn();
    wrapper = render(
      <PetiteDropdownList
        activeMini={-1}
        handleOnMiniClick={handleClick}
        petites={petites}
        loading={petites.loading}
      />
    );
    elem = wrapper.container;
  });
  it('should render the molecule', () => {
    expect(elem.querySelector('ul').nodeType === 1).toEqual(true);
    expect(elem.querySelectorAll('li').length).toBeGreaterThan(0);
    expect(elem.querySelectorAll('li').length).toEqual(3);
  });
  it('should fire an event when clicked', () => {
    elem.querySelectorAll('button').forEach((listitem) => {
      fireEvent.click(listitem);
    });

    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
