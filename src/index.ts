import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from 'cors';

import { createConnection } from "typeorm";

import config from "./config";

import { checkAuth } from "./middleware/checkAuth";
import * as authController from "./controller/auth";
import { createNft, getNftByUid, likeAsset, checkLikedAsset } from './controller/nft';

const app = express();

var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Add middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

(async () => {
  try {
    await createConnection();
    console.log("Connection to Database established");
  } catch (err) {
    console.log("DB Connection Error: " + err);
  }

  app.post("/register", checkAuth, authController.register);
  app.get("/me", checkAuth, authController.getMe);
  app.post("/create", checkAuth, createNft);
  app.get("/asset/:uid", checkAuth, getNftByUid);
  app.post("/asset/like/:assetId", checkAuth, likeAsset);
  app.get("/asset/like/:assetId", checkAuth, checkLikedAsset);

  app.post("*", (req, res) => {
    res.status(404).json({
      error: true,
      message: "Not found",
    });
  });

  const port = config.PORT || 8080;

  app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
  });
})();

export default app;
