import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    uid: string;

    @Column({ unique: true })
    email: string;

    @Column({ length: 128 })
    password: string;

    @Column()
    isActive: boolean;

    @Column({ length: 128 })
    username: string;

    @Column({ length: 128 })
    salt: string;
    
    @Column()
    isUserConfirmed: boolean;
    
    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: string

}
