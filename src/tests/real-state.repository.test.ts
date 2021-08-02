import assert from 'assert';
import { RealStateRepository } from '../repositories/real-state.repository';

const realStateRepository = new RealStateRepository();

describe('Real State Repository Test', () => {
  describe('Get Cache Key Test', () => {
    it('Should Receive Zap', () => {
      const cacheZapKey = 'zap-key';
      const key = realStateRepository.getKeyByDomain('/zap');
      assert.equal(key, cacheZapKey);
    });

    it('Should Receive Viva Real', () => {
      const cacheVivaRealKey = 'viva-real-key';
      const key = realStateRepository.getKeyByDomain('/vivareal');
      assert.equal(key, cacheVivaRealKey);
    });
  });

  describe('Location Eligibility Test', () => {
    it('Should Receive True if Latitude or Longitude are Different From 0', () => {
      const location = {
        lat: -22.9322341,
        lon: -43.1799606
      };

      const isEligible = realStateRepository.checkLocationElegibility(location);

      assert.equal(isEligible, true);
    });

    it('Should Receive False if Latitude or Longitude are Equal From 0', () => {
      const location = {
        lat: -22.9322341,
        lon: 0
      };

      const isEligible = realStateRepository.checkLocationElegibility(location);

      assert.equal(isEligible, false);
    });
  });

  describe('Zap Rental and Sale Eligibility Test', () => {
    it('Should Receive True if Rental Price is Greater or Equal than 3500', () => {
      const businessType = 'RENTAL';
      const rentalTotalPrice = 5000;

      const isEligible = realStateRepository.checkZapRentalEligibility(businessType, rentalTotalPrice);

      assert.equal(isEligible, true);
    });

    it('Should Receive False if Rental Price is Less than 3500', () => {
      const businessType = 'RENTAL';
      const rentalTotalPrice = 2999;

      const isEligible = realStateRepository.checkZapRentalEligibility(businessType, rentalTotalPrice);

      assert.equal(isEligible, false);
    });

    it('Should Receive True if Sale Price is Greater or Equal than 600000', () => {
      const businessType = 'SALE';
      const price = 700000;

      const isEligible = realStateRepository.checkZapSaleEligibility(businessType, price);

      assert.equal(isEligible, true);
    });

    it('Should Receive False if Sale Price is Less than 600000', () => {
      const businessType = 'SALE';
      const price = 599999;

      const isEligible = realStateRepository.checkZapSaleEligibility(businessType, price);

      assert.equal(isEligible, false);
    });
  });

  describe('Viva Real Rental and Sale Eligibility Test', () => {
    it('Should Receive True if Rental Price is Less or Equal than 4000', () => {
      const businessType = 'RENTAL';
      const rentalTotalPrice = 4000;

      const isEligible = realStateRepository.checkVivaRealRentalEligibility(businessType, rentalTotalPrice);

      assert.equal(isEligible, true);
    });

    it('Should Receive False if Rental Price is Greater than 4000', () => {
      const businessType = 'RENTAL';
      const rentalTotalPrice = 4001;

      const isEligible = realStateRepository.checkVivaRealRentalEligibility(businessType, rentalTotalPrice);

      assert.equal(isEligible, false);
    });

    it('Should Receive True if Sale Price is Less or Equal than 700000', () => {
      const businessType = 'SALE';
      const price = 700000;

      const isEligible = realStateRepository.checkVivaRealSaleEligibility(businessType, price);

      assert.equal(isEligible, true);
    });

    it('Should Receive False if Sale Price is Greater than 700000', () => {
      const businessType = 'SALE';
      const price = 700001;

      const isEligible = realStateRepository.checkVivaRealSaleEligibility(businessType, price);

      assert.equal(isEligible, false);
    });
  });

  describe('M² Eligibility Test', () => {
    it('Calculate M² Value Should Receive 100', () => {
      const price = 1000;
      const m2 = 10;

      const m2Value = realStateRepository.calculateM2Value(m2, price);
      assert.equal(m2Value, 100);
    });

    it('Should Receive False if M² Value is Equal 0', () => {
      const price = 1000;
      const m2 = 0;

      const isEligible = realStateRepository.checkM2Eligibility(m2, price);
      assert.equal(isEligible, false);
    });

    it('Should Receive False if M² Value is Less or Equal than 3500', () => {
      const price = 600000;
      const m2 = 200;

      const isEligible = realStateRepository.checkM2Eligibility(m2, price);
      assert.equal(isEligible, false);
    });

    it('Should Receive True if M² Value is Greater than 3500', () => {
      const price = 600000;
      const m2 = 80;

      const isEligible = realStateRepository.checkM2Eligibility(m2, price);
      assert.equal(isEligible, true);
    });
  });

  describe('Condo Eligibility Test', () => {
    it('Should Receive False if Monthly Condo Fee is Greater or Equal than 30% of Rental Value', () => {
      const monthlyCondoFee = 900;
      const rentalTotalPrice = 3000;

      const isEligible = realStateRepository.checkCondoEligibility(monthlyCondoFee, rentalTotalPrice);
      assert.equal(isEligible, false);
    });

    it('Should Receive True if Monthly Condo Fee is Less than 30% of Rental Value', () => {
      const monthlyCondoFee = 800;
      const rentalTotalPrice = 3000;

      const isEligible = realStateRepository.checkCondoEligibility(monthlyCondoFee, rentalTotalPrice);
      assert.equal(isEligible, true);
    });
  });

  describe('Bounding Box Range Eligibility Test', () => {
    it('Should Receive False if Latitude and Longitude is Out of Range', () => {
      const location = {
        lat: -22.9322341,
        lon: -43.1799606
      };

      const isEligible = realStateRepository.checkInBoundingBox(location);
      assert.equal(isEligible, false);
    });

    it('Should Receive False if Latitude and Longitude is Inside of Range', () => {
      const location = {
        lat: -23.556686,
        lon: -46.651146
      };

      const isEligible = realStateRepository.checkInBoundingBox(location);
      assert.equal(isEligible, true);
    });
  });

  describe('Increase and Decrease Value Test', () => {
    it('Should Receive 900', () => {
      const realState = {
        pricingInfos: {
          price: 1000
        }
      };

      const realStateUpdated = realStateRepository.decreaseSaleValue(realState);
      assert.equal(realStateUpdated.pricingInfos.price, 900);
    });

    it('Should Receive 1500', () => {
      const realState = {
        pricingInfos: {
          rentalTotalPrice: 1000
        }
      };

      const realStateUpdated = realStateRepository.increaseRentalValue(realState);
      assert.equal(realStateUpdated.pricingInfos.rentalTotalPrice, 1500);
    });
  });
});
