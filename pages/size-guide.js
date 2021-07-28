import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import SizeGuide from '../organs/size-guide';

import { Page, Content } from '../theme/page';

const SizeGuidePage = (props) => (
  <>
    <Head>
      <title>Maisonette Size Guide</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/size-guide`} />
    </Head>
    <Page background="default" id="maincontent">
      <Content>
        <SizeGuide selected={props.selected} />
      </Content>
    </Page>
  </>
);

export async function getServerSideProps({ query: { selected = null } }) {
  return {
    props: { selected }
  };
}

SizeGuidePage.defaultProps = {
  selected: 'clothing'
};

SizeGuidePage.propTypes = {
  selected: PropTypes.string
};

export default SizeGuidePage;
