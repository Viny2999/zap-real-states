import { LoggerService } from '.';
import Cache from 'node-cache';

export class CacheService {
  public readonly cache = new Cache();
  private readonly logger = LoggerService.getLogger();

  public set(key: string, obj: any, time: number = 0): void {
    try {
      this.cache.set(key, obj, time);
      this.logger.debug('CacheService :: setCache :: cacheSeted');
    } catch (error) {
      this.logger.error('CacheService :: setCache :: Error ', error);
    }
  }

  public get(key: string): any {
    try {
      const value = this.cache.get(key);
      this.logger.debug(`CacheService :: getCache :: ${JSON.stringify(value, null, 2)}`);
      return value;
    } catch (error) {
      this.logger.error('CacheService :: getCache :: Error ', error);
    }
  }
}
