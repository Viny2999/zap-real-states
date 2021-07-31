import { AxiosService, CacheService, LoggerService } from '../services/.';

const axiosService = new AxiosService();
const cacheService = new CacheService();
const logger = LoggerService.getLogger();

const axios = axiosService.getInstance();

export class RealStateRepository {

  public async getAll(domain: string): Promise<any> {
    const cacheKey = this.getKeyByDomain(domain);

    try {
      let data;

      if(cacheService.checkKey(cacheKey)) {
        data = cacheService.get(cacheKey);
      } else {
        data = await (await axios.get('/sources/source-2.json')).data;
        cacheService.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      logger.error('RealStateRepository :: getAll :: Error : ', error.message);
      throw new Error(error.message);
    }
  }

  private getKeyByDomain(domain: string): string {
    const cacheZapKey = 'zap-key';
    const cacheVivaRealKey = 'viva-real-key';

    return domain.includes('zap') ? cacheZapKey : cacheVivaRealKey;
  }
}
