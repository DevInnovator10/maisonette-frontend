import React from 'react';

import CMSwithAlgolia from '../../../organisms/algolia-cms/index';
import withPillarPageServerSideProps from '../../../organisms/algolia-cms/withPillarPageServerSideProps';

const CategoryPillarPage = (props) => (
  <CMSwithAlgolia {...props} />
);

export const getServerSideProps = withPillarPageServerSideProps({ type: 'category' });

export default CategoryPillarPage;
