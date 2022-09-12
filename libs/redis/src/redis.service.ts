import { CACHE_MANAGER } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async get(key: string) {
		const email: string | null = await this.cacheManager.get(key);
		return email;
	};

	set (key: string, value: string, time: number) {
		this.cacheManager.set(key, value,{ ttl: time });
	}

	del (key: string) {
		this.cacheManager.del(key)
	}
}
