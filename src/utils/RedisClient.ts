import * as redis from "redis";
import Logger from "./Logger";
import {HelperFunctions} from "./index";

class RedisClient {
	private client: redis.RedisClientType | undefined;
	url: string = process.env.REDIS_URL || 'redis://redis:6379';

	async init() {

		this.client = redis.createClient({url: this.url, legacyMode: true});

		this.client.on('error', (err: any) => Logger.error('Redis Error: ', err));

		this.client.connect().then(() => {
			Logger.info('Redis Connected Successfully');
		});

		return this.client;
	}

	// return all keys matching pattern (e.g. item:filter:*)
	async getKeys(pattern: string) {
		return new Promise((resolve, reject) => {
			if (!HelperFunctions.isExists(this.client)) {
				reject(new Error("Redis client not initialized"));
			} else {
				// @ts-ignore
				this.client.keys(`${pattern}*`, (err, keys) => {
					if (HelperFunctions.isExists(err)) {
						reject(err);
					} else {
						resolve(keys);
					}
				});
			}
		});
	}

	// delete all keys matching pattern (e.g. item:filter:*)
	async deleteKeys(pattern: string) {
		return new Promise((resolve, reject) => {
			if (!HelperFunctions.isExists(this.client)) {
				reject(new Error("Redis client not initialized"));
			} else {
				// @ts-ignore
				this.client.keys(`${pattern}*`, (err, keys) => {
					if (HelperFunctions.isExists(err)) {
						reject(err);
					} else {
						// @ts-ignore
						this.client.del(keys, (err, reply) => {
							if (HelperFunctions.isExists(err)) {
								reject(err);
								Logger.error('Redis error while deleting ${reply} keys: ', err);
							} else {
								Logger.info(`Redis Deleted ${reply} keys matching pattern ${pattern} successfully!`);
								resolve(reply);
							}
						});
					}
				});
			}
		});
	}

	// read value from redis by key (e.g. item:filter:123)
	async get(key: string) {
		return new Promise((resolve, reject) => {
			if (!HelperFunctions.isExists(this.client)) {
				reject(new Error("Redis client not initialized"));
			} else {
				// @ts-ignore
				this.client.get(key, (err, reply) => {
					if (HelperFunctions.isExists(err)) {
						reject(err);
					} else {
						resolve(reply);
					}
				});
			}
		});
	}
}

export default new RedisClient();
