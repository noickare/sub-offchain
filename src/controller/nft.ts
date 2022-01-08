import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { Nft } from "../entity/Nft";
import { NftLike } from "../entity/NftLikes";
import { getConnection } from "typeorm";
/**
 *
 * @param req
 * @param res
 */
export async function createNft(req: Request, res: Response) {
  const { name, description, price, tags, image, tokenId } = req.body;

  const loggedInUser = await User.findOne({ uid: req.user });
  try {
    const nft = new Nft();
    nft.name = name;
    nft.description = description;
    nft.price = price;
    nft.tags = tags;
    nft.image = image;
    nft.uid = uuidv4();
    nft.owner = loggedInUser;
    nft.seller = loggedInUser;
    nft.tokenId = tokenId;

    const savedNft = await nft.save();
    res.status(StatusCodes.OK).send({ message: "success", data: savedNft });
  } catch (error) {
    console.log("error creating nft", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function getNftByUid(req: Request, res: Response) {
  try {
    const nft = await Nft.find({
      relations: ["owner"],
      where: { uid: req.params.uid },
    });
    if (nft) {
      res.status(StatusCodes.OK).send({ message: "success", data: nft });
    } else {
      return res.status(StatusCodes.NOT_FOUND).send({
        error: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
    }
  } catch (error) {
    console.log("error getting nft", error);
    return res.status(StatusCodes.NOT_FOUND).send({
      error: getReasonPhrase(StatusCodes.NOT_FOUND),
    });
  }
}

export async function likeAsset(req: Request, res: Response) {
  try {
    if (req.params.assetId) {
      const loggedInUser = await User.findOne({ uid: req.user });
      const toLikeAsset = await Nft.findOne({ uid: req.params.assetId });
      const isLiked = await NftLike.find({
        where: [{ nft: toLikeAsset }, { user: loggedInUser }],
      });
      const likedAsset = new NftLike();
      likedAsset.user = loggedInUser;
      likedAsset.nft = toLikeAsset;
      likedAsset.isLiked = true;
      let toReturn = undefined;
      if (isLiked.length > 0) {
        toReturn = await getConnection()
          .createQueryBuilder()
          .update(NftLike)
          .set({ isLiked: !isLiked[0].isLiked })
          .where("id = :id", { id: isLiked[0].id })
          .execute();
      } else {
        toReturn = await likedAsset.save();
      }
      toReturn &&
        res.status(StatusCodes.OK).send({ message: "success", data: toReturn });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      });
    }
  } catch (error) {
    console.log("error getting nft", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function checkLikedAsset(req: Request, res: Response) {
  try {
    if (req.params.assetId) {
      const loggedInUser = await User.findOne({ uid: req.user });
      const toLikeAsset = await Nft.findOne({ uid: req.params.assetId });
      const isLiked = await NftLike.find({
        where: [{ nft: toLikeAsset }, { user: loggedInUser }],
      });
      res
        .status(StatusCodes.OK)
        .send({ message: "success", data: isLiked.length > 0 ? isLiked[0].isLiked : false });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      });
    }
  } catch (error) {
    console.log("error getting nft", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
