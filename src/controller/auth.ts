import { Request, Response } from "express";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
import { AuthService } from "../services/Auth";

const authService = new AuthService();

/**
 *
 * @param req
 * @param res
 */
export async function register(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const result = await authService.register(email, req.user);
    res.status(StatusCodes.OK).send({ message: "success", data: result });
  } catch (err) {
    if (String(err).includes("Email")) {
      return res.status(StatusCodes.CONFLICT).send({
        error: "Email is taken",
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function getMe(req: Request, res: Response) {
  const userId = req.user;
  try {
    const result = await authService.getUser(userId);
    if (result) {
      return res
        .status(StatusCodes.OK)
        .send({ message: "success", data: result });
    }
  } catch (err) {
    if (String(err).includes("found")) {
      return res.status(StatusCodes.NOT_FOUND).send({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
