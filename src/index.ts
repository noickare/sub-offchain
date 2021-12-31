import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import { createConnection } from "typeorm";

import config from "./config";

import * as validatorMiddleware from "./middleware/validator";
import * as authController from "./controller/auth";

const app = express();
// Add middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

  app.post("/register", validatorMiddleware.register, authController.register);
  app.get("/confirmemail", validatorMiddleware.confirmEmail, authController.confirmEmail);

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
