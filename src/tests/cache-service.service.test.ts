import assert from 'assert';
import { CacheService } from '../services';

const cacheService = new CacheService();

describe('Test Cache Service', () => {
  const key = 'test';
  const value = 123;

  it('Insert and Retrieve', () => {
    cacheService.set(key, value);
    const valueCached = cacheService.get(key);
    cacheService.deleteKey(key);

    assert.equal(valueCached, value);
  });

  it('Check Key Method: Should Receive False', () => {
    const hasKey = cacheService.checkKey(key);
    assert.equal(hasKey, false);
  });

  it('Check Key Method: Should Receive True', () => {
    cacheService.set(key, value);
    const hasKey = cacheService.checkKey(key);
    cacheService.deleteKey(key);

    assert.equal(hasKey, true);
  });

  it('Deleting Key', () => {
    cacheService.set(key, value);
    cacheService.deleteKey(key);
    const hasKey = cacheService.checkKey(key);

    assert.equal(hasKey, false);
  });
});
