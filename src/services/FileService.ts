import {CrudInterface} from "../configs";
import {CreateFileDto} from "../dtos";
import {HelperFunctions} from "../utils";
import {FileDao} from "../daos";


class FileService implements CrudInterface {
	async create(resource: CreateFileDto) {
		return await FileDao.createFile(resource);
	}

	async remove(id: number) {
		return await FileDao.remove(id);
	}

	async list(limit: number, page: number) {
		return await FileDao.getFiles(limit, page);
	}

	async detail(id: number) {
		return await FileDao.getFile(id);
	}

	upload(files: any): Promise<any> {
		return new Promise((resolve) => {
			files.map(async function (file: Express.Multer.File) {
				const results = await FileDao.saveMultipleFiles(file.buffer);
				if (HelperFunctions.isExists(results)) {
					resolve(results.raw)
				} else {
					resolve(null);
				}
			});

		});
	}
}

export default new FileService();
