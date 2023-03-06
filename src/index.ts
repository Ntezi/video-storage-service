import dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
	Logger.error(dotenvResult.error.toString())
	throw dotenvResult.error;
}
import "reflect-metadata";
import express from 'express';
import * as path from "path";
import {FileRoute} from "./routes";
import {Logger, RedisClient} from "./utils";
import {RouteConfig, ServerConfig} from "./configs";
import VideoStorageDataSource from "./configs/db/VideoStorageDataSource";


const app: express.Application = express();

const routes: Array<RouteConfig> = [];
const port = process.env.VIDEO_STORAGE_SERVER_PORT || 2202;

ServerConfig.createServer(app, path.join(__dirname, '/swagger/api.yaml'))
	.then((server) => {
		routes.push(<RouteConfig>new FileRoute(app));
		server.listen(port, async () => {
			Logger.info(`Video Storage Server is up and running at http://localhost:${port}`);
			routes.forEach((route: RouteConfig) => {
				Logger.debug(`Video Storage Routes configured for ${route.getName()}`);
			});
		});
	})
	.then(() => RedisClient.init()
		.then(() => { Logger.info(`Redis Client has been initialized in Video Storage Server!`)})
		.catch((error) => { Logger.error(`Error during Redis Client initialization in Video Storage Server: ${error}`)})
	)
	.then(() => VideoStorageDataSource.initialize()
		.then(() => {
			Logger.info(`Video Storage Data Source has been initialized! -  Database Driver Type : '${VideoStorageDataSource.driver.options.type}' - Database: '${VideoStorageDataSource.options.database}'`);
		})
		.catch((error: any) => { Logger.error(`Error during Video Storage Data Source initialization: ${error}`)})
	)
	.catch((error) => {
		Logger.error(`Error during Video Storage Server initialization: ${error}`);
	});
