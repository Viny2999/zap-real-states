import { Request, Response } from 'express';
import { LoggerService } from '.';

const logger = LoggerService.getLogger();

export class RealStateService {

  public getZap(req: Request, res: Response): Response {
    logger.debug('HealthCheckService :: checkHealth :: Status of application retrivied');

    return res.send({
      apiName: 'getZap'
    });
  }

  public getVivaReal(req: Request, res: Response): Response {
    logger.debug('HealthCheckService :: checkHealth :: Status of application retrivied');

    return res.send({
      apiName: 'getVivaReal'
    });
  }
}
