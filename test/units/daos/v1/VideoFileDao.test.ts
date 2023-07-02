import { expect } from 'chai';
import {DataSource, EntityManager, Repository} from 'typeorm';
import VideoFileDao from "../../../../src/daos/v1/VideoFileDao";
import {VideoFile} from "../../../../src/entities/v1/VideoFile";
import {videoStorageDataSourceOptions} from "../../../../src/configs/db/VideoStorageDataSource";
import sinon from 'sinon';


describe('VideoFileDao', () => {
	let connection: DataSource;
	let videoFileRepository: Repository<VideoFile>;
	let entityManager: EntityManager;

	before(async () => {
		connection = new DataSource(videoStorageDataSourceOptions);
	});

	beforeEach(() => {
		videoFileRepository = connection.manager.getRepository(VideoFile);
		entityManager = sinon.createStubInstance(EntityManager);
		(entityManager.getRepository as sinon.SinonStub).returns(videoFileRepository);
	});

	it('should create a new video file', async () => {
		const videoFile: VideoFile = new VideoFile();
		videoFile.file_id = 'test-file-id';
		videoFile.file_name = 'test-file.mp4';
		videoFile.size = 1024;
		videoFile.created_at = new Date();

		const saveStub = sinon.stub(videoFileRepository, 'save').resolves(videoFile);
		const createdVideoFile = await VideoFileDao.createFile(videoFile);

		expect(saveStub.calledOnce).to.be.true;
		expect(createdVideoFile).to.be.instanceOf(VideoFile);
		expect(createdVideoFile?.file_id).to.equal(videoFile.file_id);
	});

	// Add the rest of the test cases for the DAO here
});
