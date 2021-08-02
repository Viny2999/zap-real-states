import assert from 'assert';
import { RealStateRepository } from '../repositories/real-state.repository';

const realStateRepository = new RealStateRepository();

describe('Test Real State Repository', () => {
  it('Get Cache Key: Should Receive Zap', () => {
    const cacheZapKey = 'zap-key';
    const key = realStateRepository.getKeyByDomain('/zap');
    assert.equal(key, cacheZapKey);
  });

  it('Get Cache Key: Should Receive Viva Real', () => {
    const cacheVivaRealKey = 'viva-real-key';
    const key = realStateRepository.getKeyByDomain('/vivareal');
    assert.equal(key, cacheVivaRealKey);
  });

  it('Location Eligibility: Should Receive True If Latitude or Longitude are Different From 0', () => {
    const location = {
      lat: -22.9322341,
      lon: -43.1799606
    };

    const isEligible = realStateRepository.checkLocationElegibility(location);

    assert.equal(isEligible, true);
  });

  it('Location Eligibility: Should Receive False If Latitude or Longitude are Equal From 0', () => {
    const location = {
      lat: -22.9322341,
      lon: 0
    };

    const isEligible = realStateRepository.checkLocationElegibility(location);

    assert.equal(isEligible, false);
  });
});
