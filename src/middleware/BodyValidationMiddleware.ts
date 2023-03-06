import express from 'express';
import {validationResult} from 'express-validator';
import {CustomResponse, HelperFunctions} from "../utils";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

/**
 * This middleware is used to validate the body fields and uploaded files from all services before proceeding to the next middleware.
 */
class BodyValidationMiddleware {
	verifyBodyFieldsErrors(req: express.Request, res: express.Response, next: express.NextFunction) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return CustomResponse.returnErrorResponse(res, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
		}
		next();
	}

	verifyUploadedFiles(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!HelperFunctions.isExists(req.files)) {
			return CustomResponse.returnErrorResponse(res, StatusCodes.BAD_REQUEST, 'No file were uploaded.');
		}
		next();
	}
}

export default new BodyValidationMiddleware();
