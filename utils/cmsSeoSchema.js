const cmsSeoSchemas = {
  '/faq': ({ modules }) => {
    const accordions = modules.filter((m) => m.Title === 'accordion');
    const faqEntities = accordions.length > 0 && accordions.map((mod) => {
      const { Content } = mod;

      return {
        '@type': 'Question',
        name: Content?.accordion_heading,
        acceptedAnswer: {
          '@type': 'Answer',
          text: Content?.accordion_content
        }
      };
    });

    if (faqEntities) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqEntities
      };
    }
    return false;
  }
};

const getCmsSeoSchema = ((props) => {
  const { URL } = props.page;
  const schema = cmsSeoSchemas?.[URL]?.(props);
  return JSON.stringify(schema) ?? false;
});

export default getCmsSeoSchema;
