import { Request, Response } from 'express';
import { LoggerService } from '.';
import moment from 'moment';

const logger = LoggerService.getLogger();

export class HealthCheckService {

  public checkHealth(req: Request, res: Response): Response {
    logger.debug('HealthCheckService :: checkHealth :: Status of application retrivied');

    const secondsToMiliseconds = seconds => seconds * 1000;
    const uptimeHumanDate = moment.utc(secondsToMiliseconds(process.uptime())).format('HH:mm');

    return res.send({
      apiName: 'eng-zap-challenge',
      uptime: uptimeHumanDate,
      creator: 'Vinicius Menezes',
      endpoints: {
        realState: `${req.protocol}://${req.headers.host}/realState`,
      }
    });
  }
}
