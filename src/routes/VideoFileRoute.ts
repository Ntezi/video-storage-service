import express from 'express';
import {RouteConfig} from "../configs";
import VideoFileController from "../controllers/VideoFileController";
import FileMiddleware from "../middleware/FileMiddleware";
import {StatusCodes} from "http-status-codes";
import VideoFileStorage from "../utils/VideoFileStorage";

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
				FileMiddleware.handleBoundary,
				VideoFileStorage.singleUpload,
				FileMiddleware.verifyUploadedFiles,
				FileMiddleware.validateDuplicateFile,
				VideoFileController.uploadVideoFile
			);

		this.app
			.route(`/v1/:filename`)
			.get(VideoFileController.deleteFile);

		this.app
			.route(`/v1/files/:fileid`)
			.all(
				FileMiddleware.validateFileExists,
			)
			.get(VideoFileController.getFileById)
			.delete(VideoFileController.deleteFile);

		return this.app;
	}
}
