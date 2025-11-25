describe('Index exports', () => {
  it('should export ITop node and ITopApi credentials', () => {
    const indexModule = require('./index');
    expect(indexModule).toBeDefined();
    expect(indexModule.ITop).toBeDefined();
    expect(indexModule.ITopApi).toBeDefined();
  });
});