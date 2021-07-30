import { RealStateService } from '../services';
import { Router } from 'express';
import Joi from 'joi';
import { Validate } from '../middlewares/validation';

const router = Router();
const realStateService = new RealStateService();

router.get('/zap',
  Validate('query', {
    limit: Joi.number().greater(0).default(10).optional(),
    page: Joi.number().greater(0).default(1).optional()
  }),
  realStateService.getZap);

router.get('/vivareal',
  Validate('query', {
    limit: Joi.number().greater(0).default(10).optional(),
    page: Joi.number().greater(0).default(1).optional()
  }),
  realStateService.getVivaReal);

export const RealStateController: Router = router;
