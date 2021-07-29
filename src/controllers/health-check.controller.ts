import { HealthCheckService } from '../services/health-check.service';
import { Router } from 'express';

const router = Router();
const healthCheckService = new HealthCheckService();

router.get('/', healthCheckService.checkHealth);

export const HealthCheckController: Router = router;
