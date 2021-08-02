import { LoggerService } from '.';
import Cache from 'node-cache';

export class CacheService {
  public readonly cache = new Cache();
  private readonly logger = LoggerService.getLogger();

  public set(key: string, obj: any): void {
    try {
      this.cache.set(key, obj, process.env.CACHE_TIME);
      this.logger.debug('CacheService :: setCache :: cacheSeted');
    } catch (error) {
      this.logger.error('CacheService :: setCache :: Error ', error);
    }
  }

  public get(key: string): any {
    try {
      const value = this.cache.get(key);
      this.logger.debug(`CacheService :: getCache :: cacheGeted`);
      return value;
    } catch (error) {
      this.logger.error('CacheService :: getCache :: Error ', error);
    }
  }

  public checkKey(key: string) {
    return this.cache.has(key);
  }

  public deleteKey(key: string) {
    return this.cache.del(key);
  }
}
