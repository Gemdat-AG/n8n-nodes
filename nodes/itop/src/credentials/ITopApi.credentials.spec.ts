import { ITopApi } from './ITopApi.credentials';

describe('ITopApi Credentials', () => {
  it('should have correct credential definition', () => {
    const credentials = new ITopApi();
    expect(credentials.name).toBe('iTopApi');
    expect(credentials.displayName).toBe('iTop API');
    expect(credentials.properties).toBeDefined();
    expect(credentials.properties.length).toBeGreaterThan(0);
    
    // Check that URL property exists
    const urlProperty = credentials.properties.find(p => p.name === 'url');
    expect(urlProperty).toBeDefined();
    expect(urlProperty?.type).toBe('string');
    
    // Check that username property exists
    const usernameProperty = credentials.properties.find(p => p.name === 'username');
    expect(usernameProperty).toBeDefined();
    expect(usernameProperty?.type).toBe('string');
    
    // Check that password property exists
    const passwordProperty = credentials.properties.find(p => p.name === 'password');
    expect(passwordProperty).toBeDefined();
    expect(passwordProperty?.type).toBe('string');
  });

  it('should have authenticate method', () => {
    const credentials = new ITopApi();
    expect(credentials.authenticate).toBeDefined();
  });

  it('should have test method', () => {
    const credentials = new ITopApi();
    expect(credentials.test).toBeDefined();
  });
});