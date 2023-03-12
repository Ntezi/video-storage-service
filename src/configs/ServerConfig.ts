import dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
	Logger.error(dotenvResult.error.toString())
	throw dotenvResult.error;
}

import express from 'express';
import http from "http";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import * as OpenApiValidator from "express-openapi-validator";
import swagger from "swagger-ui-dist";
import * as path from "path";
import CustomResponse from "../utils/CustomResponse";
import Logger from "../utils/Logger";
import fs from "fs";
import morgan from "morgan";
import LoggerMiddleware from "../middleware/LoggerMiddleware";
import CLSMiddleware from "../middleware/CLSMiddleware";
import multer from "multer";
import {StatusCodes} from "http-status-codes";


class ServerConfig {

	async createServer(app: express.Application = express(), apiSpec: string): Promise<http.Server> {
		app.use(express.static('data/uploads/videos'));
		app.use(CLSMiddleware.createNamespace)
		app.use(bodyParser.json());
		app.use(cors());
		app.use(helmet());
		app.use(LoggerMiddleware)
		app.use(express.json());
		app.use(express.text());
		app.use(express.urlencoded({extended: false}));

		// create a stream (in append mode)
		const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

		// setup the logger
		app.use(morgan('combined', {stream: accessLogStream}));


		app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.set({"Content-Security-Policy": "default-src 'self' 'unsafe-inline';"})
			next();
		});

		const swaggerFolder = apiSpec.split(path.sep).slice(0, -1).join(path.sep);

		app.use(`/`, express.static(swaggerFolder));
		app.use(`/dist`, express.static(swagger.getAbsoluteFSPath()));
		app.use(OpenApiValidator.middleware({
				apiSpec,
				validateApiSpec: false,
				validateRequests: true,
				validateResponses: false
			})
		);

		app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
			if (error instanceof multer.MulterError) {
				CustomResponse.returnErrorResponse(res, StatusCodes.UNSUPPORTED_MEDIA_TYPE, error.code)
			} else {
				CustomResponse.returnErrorResponse(res, error.status, error.message)
			}
		});

		return http.createServer(app)
	}
}

export default new ServerConfig();
