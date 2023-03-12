import {DataSource} from 'typeorm'
import {VideoFile} from "../../entities/VideoFile";

export default new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.VIDEO_STORAGE_DB_USER || "video_storage",
	password: process.env.VIDEO_STORAGE_DB_PASSWORD || "video_storage",
	database: process.env.VIDEO_STORAGE_DB_NAME || "video_storage_db",
	schema: process.env.VIDEO_STORAGE_DB_SCHEMA_NAME || "video_storage_schema",
	entities: [VideoFile],
	synchronize: false,
	logging: ["warn", "error", "log", "info", "schema"],
	maxQueryExecutionTime: 1000,
	logger: "file",
	logNotifications: true,
	migrations: ['./bin/configs/db/migrations/**/*.js', './src/configs/db/migrations/**/*.ts'],
	installExtensions: true,
	applicationName: "video-storage",
	cache: {
		type: "redis",
		options: {
			url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
			database: Number(process.env.REDIS_DATABASE) || 0,
		},
		alwaysEnabled: false,
		duration: Number(process.env.DB_CACHE_DURATION) || 7200000,
		ignoreErrors: true

	}
});
