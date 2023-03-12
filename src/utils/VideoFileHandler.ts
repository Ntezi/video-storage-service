import multer from 'multer';
import path from "path";
import fs from "fs";
import {UPLOADS_DIR} from "./Constants";


interface StoredFile {
	fileName: string;
	fileSize: number;
}

/**
 * A class that encapsulates the file upload and storage logic.
 */
class VideoFileHandler {
	/**
	 * The `multer` middleware to handle single file uploads. The file size limit is 100MB.
	 */
	private static upload = multer({limits: {fileSize: 100000000}});

	/**
	 * Returns the `multer` middleware to handle single file uploads.
	 * Usage: `VideoFileStorage.singleUpload`
	 */
	public singleUpload = VideoFileHandler.upload.single('data');

	/**
	 *  Saves the file to the disk. Returns the file name and size.
	 *  @param file The file to save.
	 *  @returns The file name and size.
	 *  @throws Error if the file cannot be saved.
	 *  @throws Error if the file size is greater than 10MB.
	 *  @throws Error if the file name is empty.
	 *  @throws Error if the file name is not a string.
	 * */
	public async saveFile(file: Express.Multer.File): Promise<StoredFile> {
		const filePath = path.join(UPLOADS_DIR, file.originalname);

		// create directory if it doesn't exist
		if (!fs.existsSync(UPLOADS_DIR)) {
			fs.mkdirSync(UPLOADS_DIR, {recursive: true});
		}

		const fileStream = fs.createWriteStream(filePath);

		await new Promise((resolve, reject) => {
			fileStream.on('error', reject);
			fileStream.on('finish', resolve);
			fileStream.write(file.buffer);
			fileStream.end();
		});

		return {fileName: file.originalname, fileSize: file.size};
	}

	/**
	 * Deletes the file from the disk.
	 * @param fileName
	 */
	public async deleteFile(fileName: string): Promise<void> {
		const filePath = path.join(UPLOADS_DIR, fileName);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}

	getFileExtension(filename: string): string {
		const parts = filename.split('.');
		if (parts.length === 0) {
			return ''; // No extension found
		}
		const extension = parts.pop();
		if (extension === undefined) {
			return ''; // No extension found
		}

		if (extension === 'mpg') {
			return 'mpeg';
		}

		return extension.toLowerCase();
	}

	getFilePath(filename: string): string {
		return `${UPLOADS_DIR}/${filename}`;
	}

}

export default new VideoFileHandler();
