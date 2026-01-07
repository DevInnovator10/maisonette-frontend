import formatCatSubcatFromHM from '.';

describe('formatCatSubcatFromHM', () => {
  let hierarchicalMenu;
  beforeEach(() => {
    hierarchicalMenu = null;
  });

  it('returns undefined for values if no hierarchicalMenu', () => {
    hierarchicalMenu = null;
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu });
    expect(categoryData).toBe(undefined);
    expect(subcategoryData).toBe(undefined);
  });

  it('only returns the correct category data when no subcategory is in HM array', () => {
    hierarchicalMenu = ['parenting'];
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu });
    expect(categoryData).toStrictEqual({ slug: 'parenting', displayName: 'Parenting' });
    expect(subcategoryData).toBe(undefined);
  });

  it('returns the correct category and subcategory data when both are in HM array', () => {
    hierarchicalMenu = ['parenting', 'work-money'];
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu });
    expect(categoryData).toStrictEqual({ slug: 'parenting', displayName: 'Parenting' });
    expect(subcategoryData).toStrictEqual({ slug: 'work-money', displayName: 'Work & Money' });
  });

  it('only returns the correct category data when no subcategory is in HM string', () => {
    hierarchicalMenu = 'development';
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu });
    expect(categoryData).toStrictEqual({ slug: 'development', displayName: 'Child Development' });
    expect(subcategoryData).toBe(undefined);
  });

  it('returns the correct category and subcategory data when both are in HM string', () => {
    hierarchicalMenu = 'health > self-care';
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({ hierarchicalMenu });
    expect(categoryData).toStrictEqual({ slug: 'health', displayName: 'Health & Wellness' });
    expect(subcategoryData).toStrictEqual({ slug: 'self-care', displayName: 'Self-care & Wellness' });
  });
});
