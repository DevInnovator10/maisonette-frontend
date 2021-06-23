import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamicModules from '../../tissues/dynamicModules';

import LeScoopBreadCrumbs from './le_scoop-breadcrumbs';

import isFullWidthBelowMedium from '../../utils/isFullWidthBelowMedium';
import isFullWidthMobileOnly from '../../utils/isFullWidthMobileOnly';
import isModuleBackgroundWhite from '../../utils/isModuleBackgroundWhite';
import hasHr from '../../utils/hasHr';
import { Content } from '../../theme/page';

const isCircleBanner = (modulename) => modulename === 'circle_banner';
const isDoubleBanner = (modulename) => modulename === 'double_banner';
const isAccordion = (modulename) => modulename === 'accordion';
const isSocialShare = (modulename) => modulename === 'social_share';
const isBlockQuote = (modulename) => modulename === 'block_quote';
const isCategoryTaxonShop = (modulename) => modulename === 'category_taxon_shop';

const PageModules = ({
  page, modules, category, subcategory
}) => {
  const router = useRouter() ?? {};
  const templates = modules?.map((module) => (
    {
      Template: dynamicModules[module.Title],
      data: module.Content,
      cmsPosition: module.position,
      title: module.Title
    }
  ));

  const sortedTemplates = templates?.sort((a, b) => a.cmsPosition - b.cmsPosition);

  return (
    <section>
      <LeScoopBreadCrumbs category={category} subcategory={subcategory} path={router.asPath} />
      {
        sortedTemplates?.length > 0 && (
          sortedTemplates.map((template, index) => {
            const {
              Template,
              data,
              title,
              cmsPosition
            } = template;
            return Object.keys(data ?? {}).length > 0 && (
              <Content
                className="cms-content"
                template={template}
                isCMS
                hasHr={hasHr(data)}
                isDoubleBanner={isDoubleBanner(title)}
                noPadding={title === 'markup'}
                key={`${page.id}-${title}-${cmsPosition}`}
                isCircleBanner={isCircleBanner(title)}
                isWhite={isModuleBackgroundWhite(title)}
                isAccordion={isAccordion(title)}
                isSocialShare={isSocialShare(title)}
                isBlockQuote={isBlockQuote(title)}
                isNeon={page.Background === 'neon'}
                isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                noEvents={isCategoryTaxonShop(title)}
                pillarNav={isCategoryTaxonShop(title)}
                pillarPadding={title === 'le_scoop'}
              >
                <Template
                  data={data}
                  disableLazyload={index < 2}
                  pillar
                />
              </Content>
            );
          })
        )
      }
    </section>
  );
};

PageModules.defaultProps = {
  category: null,
  subcategory: null
};

PageModules.propTypes = {
  page: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  category: PropTypes.object,
  subcategory: PropTypes.object
};

export default PageModules;
