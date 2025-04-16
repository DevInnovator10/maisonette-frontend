import React from 'react';
import { Formik, FieldArray, Form } from 'formik';
import { render } from '../../utils/tests/testTheming';
import { setInitialMinis } from '../../organs/petite-profile-form';
import PetiteProfileItem from '.';

const mini = {
  id: 1,
  user_id: 23,
  name: 'Eric Jr.',
  birth_year: 2017,
  birth_month: 3,
  birth_day: 5,
  gender_boy: true,
  gender_girl: true
};

const minis = [mini, mini, mini];

describe('petite profile item', () => {
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
      <Formik initialValues={{ profiles: setInitialMinis(minis) }}>
        {() => (
          <Form>
            <FieldArray name="profiles">
              {() => (
                <PetiteProfileItem mini={mini} indexId={mini.id} isEditing={false} />
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should have all inputs disabled', () => {
    const inputs = componentElement.querySelectorAll('input');
    [...inputs].forEach(
      (input) => expect(input.disabled).toEqual(true)
    );
  });

  it('should have all inputs enabled if editing', () => {
    componentWrapper = render(
      <Formik initialValues={{ profiles: setInitialMinis(minis) }}>
        {() => (
          <Form>
            <FieldArray name="profiles">
              {() => (
                <PetiteProfileItem mini={mini} indexId={mini.id} isEditing />
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    );

    componentElement = componentWrapper.container.firstChild;

    const inputs = componentElement.querySelectorAll('input');
    [...inputs].forEach(
      (input) => expect(input.disabled).toEqual(false)
    );
  });

  it('should have name label', () => {
    const label = componentWrapper.getByText('NAME');
    expect(label).toBeDefined();
  });

  it('should have birthdate label', () => {
    const label = componentWrapper.getByText('BIRTHDATE');
    expect(label).toBeDefined();
  });

  it('should have gender label', () => {
    const label = componentWrapper.getByText('GENDER');
    expect(label).toBeDefined();
  });

  it('should have name input with value "Freddy Mercury"', () => {
    const inputs = componentElement.querySelectorAll('input');
    const nameInput = [...inputs].find((input) => input.value === mini.name);
    expect(nameInput).toBeDefined();
  });

  it('should have birthdate input with value "2017-03-05"', () => {
    const inputs = componentElement.querySelectorAll('input');
    const birthdateInput = [...inputs].find(
      (input) => input.value === '2017-03-05'
    );

    expect(birthdateInput).toBeDefined();
  });

  it('should have gender select with value "both"', () => {
    const genderSelect = componentElement.querySelector('select');
    expect(genderSelect.value).toEqual('both');
  });

  it('should have styles', () => {
    expect(componentElement).toHaveStyle('display: block');

    const label = componentElement.querySelector('label');
    expect(label).toHaveStyle('color: #3150A2');
    expect(label).toHaveStyle('letter-spacing: 0.2em');
  });
});
