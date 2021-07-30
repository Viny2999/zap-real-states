import { LoggerService } from './logger.service';
import axios, { AxiosInstance } from 'axios';
import rax from 'retry-axios';
require('dotenv').config();

const logger = LoggerService.getLogger();

export class AxiosService {

  public getInstance(): AxiosInstance {
    const axiosInstance = axios.create({
      baseURL: process.env.BASE_URL,
      raxConfig: {
        retry: parseInt(process.env.AXIOS_RETRY),
        noResponseRetries: parseInt(process.env.AXIOS_RETRY),
        retryDelay: 100,
        onRetryAttempt: err => {
          const config = rax.getConfig(err);
          logger.error(`AxiosService :: getInstance :: Retry attempt #${config.currentRetryAttempt}`);
        }
      }
    });

    rax.attach(axiosInstance);
    return axiosInstance;
  }
}
