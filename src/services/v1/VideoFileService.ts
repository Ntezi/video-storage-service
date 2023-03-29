import {CreateVideoFileDto} from "../../dtos/v1/CreateVideoFileDto";
import VideoFileDao from "../../daos/v1/VideoFileDao";
import HelperFunctions from "../../utils/HelperFunctions";
import {VideoFileDto} from "../../dtos/v1/VideoFileDto";
import CrudInterface from "../../configs/CrudInterface";


class VideoFileService implements CrudInterface {
	async create(resource: CreateVideoFileDto) {
		const videoFile = await VideoFileDao.createFile(resource) as VideoFileDto
		return this.getFileObject(videoFile);
	}

	async remove(fileId: string) {
		return await VideoFileDao.remove(fileId);
	}

	async list(limit: number, page: number) {
		const videoFiles = await VideoFileDao.getFiles(limit, page);
		return videoFiles.map((videoFile) => {
				return this.getFileObject(videoFile);
			}
		);
	}

	async detail(fileId: string) {
		const videoFile = await VideoFileDao.getFile(fileId);
		if (HelperFunctions.isExists(videoFile)) {
			return this.getFileObject(videoFile);
		} else {
			return null;
		}
	}

	async getVideoFileByName(fileName: string) {
		const videoFile = await VideoFileDao.getVideoFileByName(fileName) as unknown as VideoFileDto;
		if (HelperFunctions.isExists(videoFile)) {
			return this.getFileObject(videoFile);
		} else {
			return null;
		}
	}

	getFileObject(videoFile: VideoFileDto) {
		const {file_id, file_name, size} = videoFile;
		return {
			fileid: file_id,
			name: file_name,
			size,
			created_at: videoFile.created_at,
		};
	}
}

export default new VideoFileService();
