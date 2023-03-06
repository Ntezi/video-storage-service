import express from 'express';
import {getReasonPhrase} from 'http-status-codes';
import Logger from "./Logger";
import {getNamespace} from "cls-hooked";

class CustomResponse {

	getRequestInfo() {
		const appNamespace = getNamespace('app');
		const requestId = (appNamespace && appNamespace.get('requestId')) || 'GLOBAL';
		const path = (appNamespace && appNamespace.get('path')) || '';
		const method = (appNamespace && appNamespace.get('method')) || '';
		return {
			request_id: requestId,
			path: path,
			method: method
		};
	}

	returnSuccessResponse(res: express.Response, data: any = null, httpStatusCode: number) {

		const request_info = this.getRequestInfo();
		const responseObject = {
			request_id: request_info.request_id,
			status_code: httpStatusCode,
			message: getReasonPhrase(httpStatusCode),
			data: data
		};
		res.status(httpStatusCode).json(responseObject);
	}

	returnErrorResponse(res: express.Response, httpStatusCode: number, error: any = null) {
		const request_info = this.getRequestInfo();
		const responseObject = {
			request_id: request_info.request_id,
			status_code: httpStatusCode,
			message: getReasonPhrase(httpStatusCode),
			error: error,

		};
		Logger.error(`[${httpStatusCode}: ${getReasonPhrase(httpStatusCode)}]`, error);
		res.status(httpStatusCode).json(responseObject);
	}
}

export default new CustomResponse();
