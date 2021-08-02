import { AxiosService, CacheService, LoggerService } from '../services/.';

const axiosService = new AxiosService();
const cacheService = new CacheService();
const logger = LoggerService.getLogger();

const axios = axiosService.getInstance();

const cacheVivaRealKey = 'viva-real-key';
const cacheZapKey = 'zap-key';

export class RealStateRepository {

  public async getAll(domain: string, page: number, limit: number): Promise<any> {
    const cacheKey = this.getKeyByDomain(domain);

    try {
      let response;

      if(cacheService.checkKey(cacheKey)) {
        response = cacheService.get(cacheKey);
      } else {
        const data = await (await axios.get('/sources/source-2.json')).data;

        const dataZapFiltered = this.filterZapData(data);
        const dataVivaRealFiltered = this.filterVivaRealData(data);

        cacheService.set(cacheZapKey, dataZapFiltered);
        cacheService.set(cacheVivaRealKey, dataVivaRealFiltered);

        response = cacheService.get(cacheKey);
      }

      return this.paginateResponse(response, page, limit);
    } catch (error) {
      logger.error('RealStateRepository :: getAll :: Error : ', error.message);
      throw new Error(error.message);
    }
  }

  private paginateResponse(data: any, page: number, limit: number): any {
    const totalCount = data.length;
    const pageCount = Math.ceil(totalCount / limit);

    const initial = limit * (page - 1);
    const final = limit * page;

    const listing = data.slice(initial, final);

    return {
      pageNumber: page,
      pageSize: limit,
      pageCount,
      totalCount,
      listing
    };
  }

  private filterZapData(realStateList: [any]) {
    return realStateList.filter(realState => {
      const m2 = this.getM2(realState);
      const price = this.getPrice(realState);
      const location = this.getLocation(realState);
      const businessType = this.getBusinessType(realState);
      const rentalTotalPrice = this.getRentalTotalPrice(realState);

      if(this.checkLocationElegibility(location)) {
        if (this.checkZapSaleEligibility(businessType, price) && this.checkM2Eligibility(m2, price)) {
          if (this.checkInBoundingBox(location)) {
            return this.decreaseSaleValue(realState);
          }
          return realState;
        } else if (this.checkZapRentalEligibility(businessType, rentalTotalPrice)) {
          return realState;
        }
      }
    });
  }

  private filterVivaRealData(realStateList: [any]) {
    return realStateList.filter(realState => {
      const price = this.getPrice(realState);
      const location = this.getLocation(realState);
      const businessType = this.getBusinessType(realState);
      const monthlyCondoFee = this.getMonthlyCondoFee(realState);
      const rentalTotalPrice = this.getRentalTotalPrice(realState);

      if(this.checkLocationElegibility(location)) {
        if (this.checkVivaRealSaleEligibility(businessType, price)) {
          return realState;
        } else if (this.checkVivaRealRentalEligibility(businessType, rentalTotalPrice) && this.checkCondoEligibility(monthlyCondoFee, rentalTotalPrice)) {
          if (this.checkInBoundingBox(location)) {
            return this.increaseRentalValue(realState);
          }
          return realState;
        }
      }
    });
  }

  public getKeyByDomain(domain: string): string {
    return domain.includes('zap') ? cacheZapKey : cacheVivaRealKey;
  }

  public getPrice(realState) {
    return realState.pricingInfos.price;
  }

  public getRentalTotalPrice(realState) {
    return realState.pricingInfos.rentalTotalPrice;
  }

  public getBusinessType(realState) {
    return realState.pricingInfos.businessType;
  }

  public getMonthlyCondoFee(realState) {
    return realState.pricingInfos.monthlyCondoFee;
  }

  public getLocation(realState) {
    return realState.address.geoLocation.location;
  }

  public getM2(realState) {
    return realState.usableAreas;
  }

  public checkLocationElegibility(location): boolean {
    return location.lon !== 0 && location.lat !== 0;
  }

  public checkZapRentalEligibility(businessType, rentalTotalPrice): boolean {
    return businessType === 'RENTAL' && rentalTotalPrice >= 3500;
  }

  public checkZapSaleEligibility(businessType, price): boolean {
    return businessType === 'SALE' && price >= 600000;
  }

  public checkVivaRealRentalEligibility(businessType, rentalTotalPrice): boolean {
    return businessType === 'RENTAL' && rentalTotalPrice <= 4000;
  }

  public checkVivaRealSaleEligibility(businessType, price): boolean {
    return businessType === 'SALE' && price <= 700000;
  }

  public calculateM2Value(m2, price): number {
    return price / m2;
  }

  public checkM2Eligibility(m2, price): boolean {
    return m2 === 0 ? false : this.calculateM2Value(m2, price) > 3500;
  }

  public checkCondoEligibility(monthlyCondoFee, rentalTotalPrice): boolean {
    return monthlyCondoFee < (rentalTotalPrice * 0.3);
  }

  public checkInBoundingBox(location): boolean {
    const minlon = -46.693419;
    const minlat = -23.568704;
    const maxlon = -46.641146;
    const maxlat = -23.546686;

    return ((location.lon >= minlon && location.lon <= maxlon) && (location.lat >= minlat && location.lat <= maxlat));
  }

  public decreaseSaleValue(realState) {
    const price = this.getPrice(realState);
    realState.pricingInfos.price =  price - price * 0.1;
    return realState;
  }

  public increaseRentalValue(realState) {
    const rentalPrice = this.getRentalTotalPrice(realState);
    realState.pricingInfos.rentalTotalPrice = rentalPrice + rentalPrice * 0.5;
    return realState;
  }
}
