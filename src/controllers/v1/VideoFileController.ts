import express from 'express';
import CustomResponse from '../../utils/CustomResponse'
import {StatusCodes} from 'http-status-codes';
import {CreateVideoFileDto} from "../../dtos/v1/CreateVideoFileDto";
import VideoFileService from "../../services/v1/VideoFileService";
import HelperFunctions from "../../utils/HelperFunctions";
import VideoFileStorage from "../../utils/VideoFileHandler";

class VideoFileController {

	async getFiles(_req: express.Request, res: express.Response) {
		try {
			const files = await VideoFileService.list(12, 0);
			res.status(StatusCodes.OK).json(files);
		} catch (error: any) {
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async getFileById(req: express.Request, res: express.Response) {
		try {
			const filename = req.params.fileid;
			const extension = VideoFileStorage.getFileExtension(filename);

			const filePath = VideoFileStorage.getFilePath(filename);

			// Set response headers
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			res.setHeader('Content-Type', `video/${extension}`);

			// Send the file as binary data
			res.sendFile(filePath);
		} catch (error: any) {
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async deleteFile(req: express.Request, res: express.Response) {
		try {
			await VideoFileService.remove(req.params.fileid);
			await VideoFileStorage.deleteFile(req.params.fileid);
			res.status(StatusCodes.NO_CONTENT).json({message: 'File was successfully removed'});
		} catch (error: any) {
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}

	async uploadVideoFile(req: express.Request, res: express.Response) {
		try {
			const uploadedFile = req.file;
			if (HelperFunctions.isExists(uploadedFile)) {
				const createVideoFileDto: CreateVideoFileDto = {
					file_name: uploadedFile.originalname,
					size: uploadedFile?.size,
				}

				const file = await VideoFileService.create(createVideoFileDto);

				if (HelperFunctions.isExists(file)) {
					// Save the file to the file system
					const {fileName, fileSize} = await VideoFileStorage.saveFile(uploadedFile);

					// Create the location header value
					const createdFileLocation = `${req.protocol}://${req.get('host')}/v1/${fileName}`;

					// Set the Location header and return the response
					res.statusCode = StatusCodes.CREATED;
					res.setHeader('Content-Type', 'text/plain');
					res.setHeader('Location', createdFileLocation);
					res.end('File uploaded');
				}
			}

		} catch (error: any) {
			CustomResponse.returnErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.toString())
		}
	}
}

export default new VideoFileController();
