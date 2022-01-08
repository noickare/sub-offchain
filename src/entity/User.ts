import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Nft } from "./Nft";
import { NftLike } from "./NftLikes";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    uid: string;

    @Column({ unique: true })
    email: string;

    @Column()
    isActive: boolean;

    @Column({ length: 128 })
    username: string;

    @Column()
    isUserConfirmed: boolean;

    @OneToMany(() => Nft, nft => nft.owner)
    nfts: Nft[];

    @OneToMany(() => Nft, nft => nft.seller)
    selling: Nft[];

    @OneToMany(() => NftLike, like => like.user)
    likes: NftLike[];

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

}
