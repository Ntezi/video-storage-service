
import {Entity, Column, CreateDateColumn, PrimaryColumn} from "typeorm";

@Entity('video_file')
export class VideoFile {
	@PrimaryColumn({nullable: false, type: "uuid"})
	file_id!: string;

	@Column({nullable: false, type: 'varchar', length: 255})
	file_name!: string;

	@Column({nullable: false, type: 'int'})
	size!: number;

	@Column({nullable: false, type: 'varchar', length: 255})
	@CreateDateColumn()
	created_at!: Date;
}
