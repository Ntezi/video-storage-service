import {EntityManager,} from "typeorm";
import {VideoFile} from '../entities'
import {CreateFileDto} from '../dtos';
import Logger from "../utils/Logger";
import {HelperFunctions, RedisClient} from "../utils";
import VideoStorageDataSource from "../configs/db/VideoStorageDataSource";

class FileDao {
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

	async getFile(fileId: number) {
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

	async createFile(createFileDto: CreateFileDto) {
		try {
			await RedisClient.deleteKeys(this.fileKeyPattern)
			const file = new VideoFile()
			file.file_name = createFileDto.name
			return await this.manager.getRepository(VideoFile).save({...file, ...createFileDto})
		} catch (error) { // Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return null; // return null in case of an error
		}
	}

	async remove(fileId: number) {
		try {
			await RedisClient.deleteKeys(this.fileKeyPattern)
			const fileRepository = this.manager.getRepository(VideoFile);
			return await fileRepository.delete(fileId);
		} catch (error) { // Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return []; // return an empty array in case of an error
		}
	}

	async saveMultipleFiles(fileData: Buffer) {
		try {
			await RedisClient.deleteKeys(this.fileKeyPattern);
			const data = fileData.toString("utf-8").split('\n');
			data.shift();
			let files: any = [];

			data.map(function (file) {
				const elements = file.replace('\r', '').split(',');
				if (elements.length === 2) {
					files.push({
						manufacture_id: 1,
						category_id: 1,
						file_name: elements[0],
						price: +elements[1]
					})
				}
			});

			return await this.manager.getRepository(VideoFile)
				.createQueryBuilder()
				.insert()
				.into(VideoFile)
				.values(files)
				.returning(['id', 'file_name', 'price', 'cost'])
				.execute();

		} catch (error) { // Catch the error and pass it to handlePostgresError
			await HelperFunctions.handlePostgresError(error)
			return null; // return an empty array in case of an error
		}
	}

}

export default new FileDao();
