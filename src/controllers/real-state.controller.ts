import { RealStateService } from '../services';
import { Router } from 'express';

const router = Router();
const realStateService = new RealStateService();

router.get('/zap', realStateService.getZap);
router.get('/vivareal', realStateService.getVivaReal);

export const RealStateController: Router = router;
