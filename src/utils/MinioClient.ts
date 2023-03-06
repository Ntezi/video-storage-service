import * as Minio from "minio";

class MinioClient {

	minioClient() {
		return new Minio.Client({
			endPoint: process.env.ENDPOINT || 'http://minio1:9000',
			accessKey: process.env.ACCESS_KEY || 'minioadmin',
			secretKey: process.env.SECRET_KEY || 'minioadmin',
			pathStyle: true,
		});
	}

	async upload(file: Buffer) {
		const minioClient: Minio.Client = this.minioClient();
		const bucketName = "cis";
		const objectFileName = "items.csv";
		const submitFileDataResult = await minioClient
			.putObject(bucketName, objectFileName, file)
			.catch((e) => {
				console.log("Error while creating object from file data: ", e);
				throw e;
			});

		console.log("File data submitted successfully: ", submitFileDataResult);
	}
}

export default new MinioClient();
