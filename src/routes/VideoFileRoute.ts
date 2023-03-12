import express from 'express';
import VideoFileController from "../controllers/VideoFileController";
import VideoFileMiddleware from "../middleware/VideoFileMiddleware";
import {StatusCodes} from "http-status-codes";
import VideoFileStorage from "../utils/VideoFileHandler";
import RouteConfig from "../configs/RouteConfig";

export class VideoFileRoute extends RouteConfig {
	constructor(app: express.Application) {
		super(app, 'VideoFileStorageRoute');
	}

	configureRoutes(): express.Application {
		this.app.get('/v1/health', (_req, res) => {
			res.status(StatusCodes.OK).end('OK');
		});
		this.app
			.route(`/v1/files`)
			.get(VideoFileController.getFiles)
			.post(
				VideoFileMiddleware.handleBoundary,
				VideoFileStorage.singleUpload,
				VideoFileMiddleware.verifyUploadedFiles,
				VideoFileMiddleware.validateDuplicateFile,
				VideoFileController.uploadVideoFile
			);

		this.app
			.route(`/v1/:filename`)
			.get(VideoFileController.deleteFile);

		this.app
			.route(`/v1/files/:fileid`)
			.all(
				VideoFileMiddleware.validateFileExists,
			)
			.get(VideoFileController.getFileById)
			.delete(VideoFileController.deleteFile);

		return this.app;
	}
}
