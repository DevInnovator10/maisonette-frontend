import React from 'react';
import { screen } from '@testing-library/react';
import JobListing from './index';
import { render } from '../../utils/tests/testTheming';

test('render No Open Roles text', () => {
  const data = [
    { jobs: [] },
    { jobs: null },
    { jobs: undefined }
  ];
  render(<JobListing list={data} />);

  expect(screen.getByText('No open roles available')).toBeInTheDocument();
});

test('should not render No Open Roles text', () => {
  const data = [
    { jobs: [] },
    {
      jobs: [
        { title: 'Frontend Engineer', location: { name: 'Remote' } }
      ]
    }
  ];
  render(<JobListing list={data} />);

  expect(screen.queryByText('No open roles available')).not.toBeInTheDocument();
});
