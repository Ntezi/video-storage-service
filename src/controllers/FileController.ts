import express from 'express';
import {FileService} from '../services';
import CustomResponse from '../utils/CustomResponse'
import {StatusCodes} from 'http-status-codes';
import Logger from "../utils/Logger";

class FileController {

	async getFiles(_req: express.Request, res: express.Response) {
		try {
			const files = await FileService.list(12, 0);
			CustomResponse.returnSuccessResponse(res, files, StatusCodes.OK);
		} catch (error: any) {
			Logger.error(error.toString())
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async getFileById(req: express.Request, res: express.Response) {
		try {
			const file = await FileService.detail(Number(req.params.id));
			CustomResponse.returnSuccessResponse(res, file, StatusCodes.OK);
		} catch (error: any) {
			Logger.error(error.toString())
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async createFile(req: express.Request, res: express.Response) {
		try {
			const file = await FileService.create(req.body);
			CustomResponse.returnSuccessResponse(res, file, StatusCodes.CREATED);
		} catch (error: any) {
			Logger.error(error.toString())
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async deleteFile(req: express.Request, res: express.Response) {
		const file = await FileService.remove(Number(req.params.userId));
		CustomResponse.returnSuccessResponse(res, file, StatusCodes.ACCEPTED);
	}

	async uploadFiles(req: express.Request, res: express.Response) {
		const files: any = req.files;
		try {
			// @ts-ignore
			const files = await FileService.upload(files)
			CustomResponse.returnSuccessResponse(res, files, StatusCodes.ACCEPTED);
		} catch (error: any) {
			Logger.error(error.toString())
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}
}

export default new FileController();
