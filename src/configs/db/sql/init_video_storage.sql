CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- video file  table
DROP TABLE IF EXISTS video_file CASCADE;
CREATE TABLE video_file
(
    file_id    VARCHAR     NOT NULL DEFAULT uuid_generate_v4(), -- unique file id
    file_name  VARCHAR     NOT NULL DEFAULT 'N/A',              -- file name with extension (e.g. video.mp4)
    size       INT         NOT NULL DEFAULT 0,                  -- file size in bytes (e.g. 123456)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- time when the file was uploaded to the server
    PRIMARY KEY (file_id)
);
CREATE INDEX video_file_file_id_index ON video_file (file_id); -- index for file_id column for faster search by file_id
CREATE INDEX video_file_name_index ON video_file (file_name); -- index for name column for faster search by name
CREATE INDEX video_file_size_index ON video_file (size); -- index for size column for faster search by size
