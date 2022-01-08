import { Request, Response, NextFunction } from "express";
import { admin } from "../config/fb_admin";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //@ts-ignore
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    // console.log(token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken) {
      req.user = decodedToken.uid;
      next();
    } else {
      res.status(403).send({ error: "Unauthorized!" });
    }
  } catch (error) {
    res.status(403).send({ error: "Unauthorized!" });
  }
}
