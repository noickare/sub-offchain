import {Request, Response, NextFunction} from "express"
import Joi from "joi"

const registerSchema = Joi.object().keys({
    "email": Joi.string().email().required(),
    "password": Joi.string().min(6).max(128).required(),
})

export function register(req: Request, res: Response, next: NextFunction) {
    const result = registerSchema.validate(req.body)
    if(result.error) {
        return res.status(400).json({
            error: true,
            message: "Invalid input parameters"
        })
    }

    next()
}

const confirmEmailSchema = Joi.object().keys({
    "email": Joi.string().email().required(),
    "c": Joi.string().min(16).required()
});

export function confirmEmail(req: Request, res: Response, next: NextFunction) {
    const result = confirmEmailSchema.validate(req.query);

    if(result.error !== null) {
        console.log(result.error);
        return res.status(400).json({
            error: true,
            message: "Invalid input parameters"
        });
    }

    next();
}