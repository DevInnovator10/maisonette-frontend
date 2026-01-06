import generateRandomHash from '.';

describe('generateRandomHash', () => {
  it('should generate hash string', () => {
    /* Math.random() always returns value of 1 instead
      of float value causing the function to return "----" without the Char values.
      Therefore, I mocked the math function and output a float value so at least the function
      can return a char value.  Not sure if there are any other workaround for this??
    */
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    const hash = generateRandomHash();
    expect(hash).toHaveLength(36);
  });
});
