import {EntityManager,} from "typeorm";
import Logger from "../utils/Logger";
import VideoStorageDataSource from "../configs/db/VideoStorageDataSource";
import {CreateVideoFileDto} from "../dtos/CreateVideoFileDto";
import {VideoFile} from "../entities/VideoFile";
import {v4 as uuid} from 'uuid';
import HelperFunctions from "../utils/HelperFunctions";
import RedisClient from "../utils/RedisClient";

class VideoFileDao {
	manager: EntityManager;
	duration: number
	fileKeyPattern: string;
	constructor() {
		Logger.debug('Created new instance of FileDao');
		this.manager = VideoStorageDataSource.manager;
		this.duration = Number(process.env.DB_CACHE_DURATION) || 7200000 // 2 hours
		this.fileKeyPattern = 'file:*';

	}

	/**
	*  Get all files from the database with pagination and cache the result for 2 hours (7200000 milliseconds)
	 *  @param limit number of files to return per page (default 25)
	 *  @param page page number (default 0)
	 *  @returns {Promise<VideoFile[]>} Promise of an array of files
	* */
	async getFiles(limit = 25, page = 0) {
		try {
			return await this.manager.getRepository(VideoFile).find({
				skip: limit * page,
				take: limit,
				order: {file_id: "ASC"},
				cache: {
					id: "file:all",
					milliseconds: this.duration,
				},
			});
		} catch (error) {
			// Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return []; // return an empty array in case of an error
		}
	}

	async getFile(fileId: string) {
		try {
			return await this.manager.getRepository(VideoFile).findOne({
				where: {file_id : fileId},
				cache: {
					id: `file:detail:${fileId}`,
					milliseconds: this.duration,
				},
			});
		} catch (error) {
			// Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return null; // return null in case of an error
		}
	}

	async createFile(createVideoFileDto: CreateVideoFileDto) {
		try {
			await RedisClient.deleteKeys(this.fileKeyPattern)
			const file = new VideoFile()
			file.file_id = createVideoFileDto.file_name;
			return await this.manager.getRepository(VideoFile).save({...file, ...createVideoFileDto})
		} catch (error) { // Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return null; // return null in case of an error
		}
	}

	getVideoFileByName(fileName: string) {
		try {
			return this.manager.getRepository(VideoFile).find({
				where: {file_name: fileName},
				cache: {
					id: `file:detail:${fileName}`,
					milliseconds: this.duration,
				},
			});
		} catch (error) {
			// Catch the error and pass it to handlePostgresError
			HelperFunctions.handlePostgresError(error)
			return null; // return null in case of an error
		}
	}

	async remove(fileId: string) {
		try {
			await RedisClient.deleteKeys(this.fileKeyPattern)
			const fileRepository = this.manager.getRepository(VideoFile);
			return await fileRepository.delete(fileId);
		} catch (error) { // Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return []; // return an empty array in case of an error
		}
	}

}

export default new VideoFileDao();
