import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import moment from 'moment';

const logger = LoggerService.getLogger();

export class HealthCheckService {

  public checkHealth(req: Request, res: Response): Response {
    logger.debug('HealthCheckService :: checkHealth :: Status of application retrivied');

    const host = `${req.protocol}://${req.headers.host}`;
    const secondsToMilliseconds = seconds => seconds * 1000;
    const momentFormat = seconds => moment.utc(secondsToMilliseconds(seconds)).format('HH:mm');
    const uptimeHumanDate = momentFormat(process.uptime());

    return res.send({
      apiName: 'eng-zap-challenge',
      uptime: uptimeHumanDate,
      creator: 'Vinicius Menezes',
      endpoints: {
        realState: {
          vivaReal: `${host}/realState/vivaReal`,
          zap: `${host}/realState/zap`
        }
      }
    });
  }
}
