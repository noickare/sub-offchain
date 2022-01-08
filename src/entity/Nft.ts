
import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { NftLike } from "./NftLikes";
import { User } from "./User";

@Entity()
export class Nft extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    uid: string;

    @Column({ length: 128 })
    tokenId: string;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column({ length: 128 })
    price: string;

    @Column("varchar", { array: true })
    tags: string[];
    
    @Column()
    image: string;

    @ManyToOne(() => User, user => user.nfts)
    owner: User;

    @ManyToOne(() => User, user => user.selling)
    seller: User;

    @OneToMany(() => NftLike, like => like.nft)
    likes: NftLike[];

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;
}
