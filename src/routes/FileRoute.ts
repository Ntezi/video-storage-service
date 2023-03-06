import express from 'express';
import multer from "multer";
import {RouteConfig} from "../configs";
import {FileMiddleware} from "../middleware";
import FileController from "../controllers/FileController";

const storage = multer.diskStorage({
	destination: function (_req: express.Request, _file, callback) {
		callback(null, '../../../data/uploads/videos');
	},
	filename: function (_req: express.Request, file, callback) {
		callback(null, file.originalname);
	}
})

const upload = multer({storage: storage});

export class FileRoute extends RouteConfig {
	constructor(app: express.Application) {
		super(app, 'Route');
	}

	configureRoutes(): express.Application {
		this.app
			.route(`/files`)
			.get(FileController.getFiles)
			.post(
				upload.single('name'),
				FileMiddleware.validateRequiredFileBodyFields,
				FileController.uploadFiles
			);

		this.app.param(`id`, FileMiddleware.extractFileId);
		this.app
			.route(`/files/:id`)
			.all(
				FileMiddleware.validateFileExists,
			)
			.get(FileController.getFileById)
			.delete(FileController.deleteFile);

		return this.app;
	}
}

export default new FileRoute(express());
