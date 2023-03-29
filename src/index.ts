import dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
	Logger.error(dotenvResult.error.toString())
	throw dotenvResult.error;
}
import "reflect-metadata";
import express from 'express';
import * as path from "path";
import {VideoStorageDataSource} from "./configs/db/VideoStorageDataSource";
import {VideoFileRoute} from "./routes/v1/VideoFileRoute";
import RedisClient from "./utils/RedisClient";
import Logger from "./utils/Logger";
import ServerConfig from "./configs/ServerConfig";
import RouteConfig from "./configs/RouteConfig";


const app: express.Application = express();

const routes: Array<RouteConfig> = [];
const port = process.env.VIDEO_STORAGE_SERVER_PORT || 2207;

routes.push(<RouteConfig>new VideoFileRoute(app));

ServerConfig.createServer(app, path.join(__dirname, '/swagger/v1/api.yaml'))
	.then((server) => {
		server.listen(port, async () => {
			Logger.info(`Video Storage Server is up and running at ${port}`);
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
