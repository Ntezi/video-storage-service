import Logger from "./Logger";
import RedisClient from "./RedisClient";
import {StatusCodes} from "http-status-codes";

class HelperFunctions {
	/**
	 * Check if a variable is not null, undefined, empty string, empty array, empty object, or has a falsy value.
	 * @template T
	 * @param {(T | null | undefined)} value - The value to check.
	 * @returns {value is T} - Returns true if the value is not null, undefined, empty string, empty array, empty object, or has a falsy value, otherwise returns false.
	 */
	isExists<T>(value: T | null | undefined): value is T {
		return typeof value !== 'undefined' && value !== null && ((typeof value === 'string' && value !== '') ||
			(Array.isArray(value) && value.length > 0) ||
			(typeof value === 'object' && Object.keys(value).length > 0) ||
			typeof value === 'number' ||
			typeof value === 'boolean')
	}

	/**
	 * Handle Postgres errors and map them to appropriate HTTP status codes and error messages.
	 * @param error - The error object returned from the Postgres database.
	 * @returns {Promise<void>} - Returns a promise that resolves to void.
	 * @see https://www.postgresql.org/docs/9.5/errcodes-appendix.html
	 */

	async handlePostgresError(error: any) {
		const errorInfo = `- ${error.detail} - ${error.table} - ${error.constraint} - ${error.columns} - ${error.schema} - ${error.file} - ${error.line} - ${error.routine}`;
		switch (error.code) {
			case "23505":
				Logger.error(`Unique constraint violation error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.CONFLICT,
					message: "Unique constraint violation error"
				};
			case "23503":
				Logger.error(`Foreign key constraint violation error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.CONFLICT,
					message: "Foreign key constraint violation error"
				};
			case "22001":
				Logger.error(`Value too long error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Value too long error"
				};
			case "23502":
				Logger.error(`Not-null constraint violation error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Not-null constraint violation error"
				};
			case "2201E":
				Logger.error(`Invalid serial error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Invalid serial error"
				};
			case "42883":
				Logger.error(`Undefined function error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
					message: "Undefined function error"
				};
			case "42804":
				Logger.error(`Datatype mismatch error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
				}
			case "22P02":
				Logger.error(`Invalid text representation error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
				}
			case "42703":
				Logger.error(`Undefined column error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
				}
			case "42601":
				Logger.error(`Syntax error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
				}
			case "42P01":
				Logger.error(`Undefined table error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.BAD_REQUEST,
				}
			default:
				Logger.error(`Internal server error ${errorInfo}`);
				throw {
					statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
					message: "Internal server error"
				};
		}
	}

	/**
	 *  Get all keys from Redis that matches the pattern. This is used to get all keys from Redis that matches the pattern and delete them from DAOs that uses Redis.
	 * */
	async getRedisKeys(pattern: string): Promise<unknown> {
		return RedisClient.getKeys(pattern)
			.then((keys) => keys)
			.catch((error) => Logger.error('REDIS_ERROR: ', error))
	}
}

export default new HelperFunctions();
