
import {Entity, Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity('video_file')
export class VideoFile {
	@PrimaryGeneratedColumn({type: 'bigint'})
	file_id!: number;

	@Column({nullable: false, type: 'varchar', length: 255})
	file_name!: string;

	@Column({nullable: false, type: 'int'})
	size!: number;

	@Column({nullable: false, type: 'varchar', length: 255})
	@CreateDateColumn()
	created_at!: Date;
}
