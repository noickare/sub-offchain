
import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Nft } from "./Nft";
import { User } from "./User";

@Entity()
export class NftLike extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Nft, nft => nft.likes)
    nft: Nft;
    
    @ManyToOne(() => User, user => user.likes)
    user: User;

    @Column()
    isLiked: boolean;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

}
