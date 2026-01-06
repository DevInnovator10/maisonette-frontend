import React from 'react';

import CMSwithAlgolia from '../../../../organisms/algolia-cms/index';
import withPillarPageServerSideProps from '../../../../organisms/algolia-cms/withPillarPageServerSideProps';

const SubcategoryPillarPage = (props) => (
  <CMSwithAlgolia {...props} />
);

export const getServerSideProps = withPillarPageServerSideProps({ type: 'subcategory' });

export default SubcategoryPillarPage;
