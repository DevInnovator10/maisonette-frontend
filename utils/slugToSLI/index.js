const slugToSLI = (slug, isBrand = false) => {
  if (!slug) return null;

  if (isBrand) {
    return slug.replace(/-|\s|[^a-zA-Z0-9]/g, '');
  }

  return slug.replace(/-and-|-|\s|[^a-zA-Z0-9]/g, '');
};
export default slugToSLI;
