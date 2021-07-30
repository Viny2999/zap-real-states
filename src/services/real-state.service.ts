import { Request, Response } from 'express';
import { AxiosService, CacheService, LoggerService } from '.';

const axiosService = new AxiosService();
const cacheService = new CacheService();
const logger = LoggerService.getLogger();

const axios = axiosService.getInstance();
export class RealStateService {

  public async getZap(req: Request, res: Response): Promise<Response> {
    const cacheZapKey = 'zap-key';

    try {
      let data;

      if(cacheService.checkKey(cacheZapKey)) {
        data = cacheService.get(cacheZapKey);
      } else {
        data = await (await axios.get('/sources/source-2.json')).data;
        cacheService.set(cacheZapKey, data);
      }

      return res.send(data);
    } catch (error) {
      logger.error('RealStateService :: getZap :: Error : ', error.message);
    }
  }

  public async getVivaReal(req: Request, res: Response): Promise<Response> {
    return res.send({
      apiName: 'getVivaReal'
    });
  }

  private paginateResponse () {
    //
  }
}
