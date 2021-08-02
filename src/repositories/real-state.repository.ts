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

  private getKeyByDomain(domain: string): string {
    return domain.includes('zap') ? cacheZapKey : cacheVivaRealKey;
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
      if(this.checkLocationElegibility(realState)) {
        if (this.checkZapSaleEligibility(realState) && this.checkM2Eligibility(realState)) {
          if (this.checkInBoundingBox(realState)) {
            return this.decreaseSaleValue(realState);
          }
          return realState;
        } else if (this.checkZapRentalEligibility(realState)) {
          return realState;
        }
      }
    });
  }

  private filterVivaRealData(realStateList: [any]) {
    return realStateList.filter(realState => {
      if(this.checkLocationElegibility(realState)) {
        if (this.checkVivaRealSaleEligibility(realState)) {
          return realState;
        } else if (this.checkVivaRealRentalEligibility(realState) && this.checkCondoEligibility(realState)) {
          if (this.checkInBoundingBox(realState)) {
            return this.increaseRentalValue(realState);
          }
          return realState;
        }
      }
    });
  }

  private getPrice(realState) {
    return realState.pricingInfos.price;
  }

  private getRentalTotalPrice(realState) {
    return realState.pricingInfos.rentalTotalPrice;
  }

  private getBusinessType(realState) {
    return realState.pricingInfos.businessType;
  }

  private getMonthlyCondoFee(realState) {
    return realState.pricingInfos.monthlyCondoFee;
  }

  private getLocation(realState) {
    return realState.address.geoLocation.location;
  }

  private getM2(realState) {
    return realState.usableAreas;
  }

  private checkLocationElegibility(realState): boolean {
    const location = this.getLocation(realState);
    return location.lon !== 0 && location.lat !== 0;
  }

  private checkZapRentalEligibility(realState): boolean {
    return this.getBusinessType(realState) === 'RENTAL' && this.getRentalTotalPrice(realState) >= 3500;
  }

  private checkZapSaleEligibility(realState): boolean {
    return this.getBusinessType(realState) === 'SALE' && this.getPrice(realState) >= 600000;
  }

  private checkVivaRealRentalEligibility(realState): boolean {
    return this.getBusinessType(realState) === 'RENTAL' && this.getRentalTotalPrice(realState) <= 4000;
  }

  private checkVivaRealSaleEligibility(realState): boolean {
    return this.getBusinessType(realState) === 'SALE' && this.getPrice(realState) <= 700000;
  }

  private calculateM2Value(realState): number {
    return this.getPrice(realState) / this.getM2(realState);
  }

  private checkM2Eligibility(realState): boolean {
    return this.getM2(realState) === 0 ? false : this.calculateM2Value(realState) > 3500;
  }

  private checkCondoEligibility(realState): boolean {
    return this.getMonthlyCondoFee(realState) < (this.getRentalTotalPrice(realState) * 0.3);
  }

  private checkInBoundingBox(realState): boolean {
    const location = this.getLocation(realState);
    const minlon = -46.693419;
    const minlat = -23.568704;
    const maxlon = -46.641146;
    const maxlat = -23.546686;

    return ((maxlon - minlon) >= location.lon && (maxlat - minlat) >= location.lat);
  }

  private decreaseSaleValue(realState): number {
    const price = this.getPrice(realState);
    realState.pricingInfos.price =  price - price * 0.1;
    return realState;
  }

  private increaseRentalValue(realState): number {
    const rentalPrice = this.getRentalTotalPrice(realState);
    realState.pricingInfos.rentalTotalPrice = rentalPrice + rentalPrice * 0.5;
    return realState;
  }
}
