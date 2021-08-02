import { RealStateRepository} from '../repositories/real-state.repository';
import { SERVER_ERROR } from '../utils/errors.json';
import { Request, Response } from 'express';
import { LoggerService } from '.';

const realStateRepository = new RealStateRepository();
const logger = LoggerService.getLogger();

export class RealStateService {

  public async getZap(req: Request, res: Response): Promise<Response> {
    const limit = parseInt(req.query.limit.toString());
    const page = parseInt(req.query.page.toString());
    const path = req.path;

    try {
      const realStateResponse = await realStateRepository.getAll(path, page, limit);

      logger.debug('RealStateService :: getZap :: Real State Zap Listed');

      return res.send(realStateResponse);
    } catch (error) {
      logger.error('RealStateService :: getZap :: Error : ', error);
      return res.status(500).send(SERVER_ERROR);
    }
  }

  public async getVivaReal(req: Request, res: Response): Promise<Response> {
    const limit = parseInt(req.query.limit.toString());
    const page = parseInt(req.query.page.toString());
    const path = req.path;

    try {
      const realStateResponse = await realStateRepository.getAll(path, page, limit);
      logger.debug('RealStateService :: getVivaReal :: Real State Viva Real Listed');

      return res.send(realStateResponse);
    } catch (error) {
      logger.error('RealStateService :: getVivaReal :: Error : ', error.message);
      return res.status(500).send(SERVER_ERROR);
    }
  }
}
