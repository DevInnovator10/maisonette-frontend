import slugToSLI from '.';

describe('slugToSLI', () => {
  it('removes non alphanumeric characters from slug', () => {
    const slug = 'book-cases-&-toy-chests-()-and-:@--------{!';
    expect(slugToSLI(slug)).toEqual('bookcasestoychests');
  });

  it('removes "-and-" from non brand slug', () => {
    const slug = 'book-cases-and-toy-chests';
    expect(slugToSLI(slug)).toEqual('bookcasestoychests');
  });

  it('preserves "-and-" on brand slug', () => {
    const slug = 'emmerson-and-friends';
    expect(slugToSLI(slug, true)).toEqual('emmersonandfriends');
  });
});
