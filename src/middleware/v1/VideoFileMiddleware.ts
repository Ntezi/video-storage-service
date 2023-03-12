import express from 'express';
import CustomResponse from "../../utils/CustomResponse";
import {StatusCodes} from "http-status-codes";
import HelperFunctions from "../../utils/HelperFunctions";
import VideoFileService from "../../services/v1/VideoFileService";

class VideoFileMiddleware {

	handleBoundary(req: express.Request, res: express.Response, next: express.NextFunction) {
		const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
		// add boundary to the content-type header
		req.headers['content-type'] = req.headers['content-type'] + `; boundary=${boundary}`;
		next();
	}
	verifyUploadedFiles(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log(req.headers['content-type']);
		if (!HelperFunctions.isExists(req.file)) {
			return CustomResponse.returnErrorResponse(res, StatusCodes.BAD_REQUEST, 'No file were uploaded.');
		} else {
			if (req.file.mimetype === 'video/mp4' || req.file.mimetype === 'video/mpeg') {
				next();
			} else {
				return CustomResponse.returnErrorResponse(res, StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'Unsupported Media Type');

			}
		}
	}

	async validateFileExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		const file = await VideoFileService.detail(req.params.fileid);
		if (HelperFunctions.isExists(file)) {
			next();
		} else {
			CustomResponse.returnErrorResponse(res, StatusCodes.NOT_FOUND, `File with ID: ${req.params.fileid} Not Found`)
		}
	}

	async validateDuplicateFile(req: express.Request, res: express.Response, next: express.NextFunction) {
		// @ts-ignore
		const file = await VideoFileService.getVideoFileByName(req.file.originalname)
		if (HelperFunctions.isExists(file)) {
			CustomResponse.returnErrorResponse(res, StatusCodes.CONFLICT, `File already exists`)
		} else {
			next();
		}
	}
}

export default new VideoFileMiddleware();
