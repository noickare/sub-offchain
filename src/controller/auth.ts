import { Request, Response } from "express";
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

    res.json({
      message: "success",
      data: result,
    });
  } catch (err) {
    if (String(err).includes("Email")) {
      return res.status(400).json({
        error: true,
        message: "Email is taken",
      });
    }
    res.status(500).json({
      error: true,
      message: "An internal server error has occurred",
    });
  }
}
