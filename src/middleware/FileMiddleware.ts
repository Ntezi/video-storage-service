import express from 'express';
import CustomResponse from "../utils/CustomResponse";
import {StatusCodes} from "http-status-codes";
import {FileService} from "../services";
import {HelperFunctions} from "../utils";

class FileMiddleware {

	async validateRequiredFileBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (HelperFunctions.isExists(req.body) && HelperFunctions.isExists(req.body.file_name) ) {
			next();
		} else {
			CustomResponse.returnErrorResponse(res, StatusCodes.BAD_REQUEST, 'Missing required fields: file_name')
		}
	}
	async validateFileExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		const file = await FileService.detail(Number(req.params.id));
		if (HelperFunctions.isExists(file)) {
			next();
		} else {
			CustomResponse.returnErrorResponse(res, StatusCodes.NOT_FOUND, `File with ID: ${req.params.id} Not Found`)
		}
	}

	async validateSearchQueryParameter(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!HelperFunctions.isExists(req.query.file_name)) {
			CustomResponse.returnErrorResponse(res, StatusCodes.BAD_REQUEST, 'Missing required query parameter: file_name')
		} else {
			next();
		}
	}

	async extractFileId(req: express.Request, _res: express.Response, next: express.NextFunction) {
		req.body.id = req.params.fileId;
		next();
	}

	async extractFileName(req: express.Request, _res: express.Response, next: express.NextFunction) {
		req.body.file_name = req.query.file_name;
		next();
	}
}

export default new FileMiddleware();
