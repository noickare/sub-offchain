import * as argon2 from "argon2";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  names,
  starWars,
} from "unique-names-generator";

import { User } from "../entity/User";
import config from "../config";
import sendEmail from "../utils/sendEmail";

const customConfig: Config = {
  dictionaries: [adjectives, names, starWars],
  separator: "-",
  length: 2,
};

export class AuthService {
  constructor() {}

  async sendConfirmationEmail(email: string) {
    const redisClient = config.REDIS_CLIENT;
    const uniqueCode = this.generateSalt();
    redisClient.hSet(`confirmation_${email}`, 60 * 60 * 24, uniqueCode);
    console.log(uniqueCode);
    const link = `${config.APP_DOMAIN}/confirmemail?email=${email}&c=${uniqueCode}`;
    try {
      await sendEmail("confirmation", {
        email: email,
        link,
      });
      console.log("Email sent");
    } catch (err) {
      console.log(`Error sending confirmation email to ${email}: ${err}`);
      throw new Error(`Error sending confirmation email to ${email}: ${err}`);
    }
  }

  confirmEmail(email: string, code: string) {
    return new Promise(async (resolve, reject) => {
      const redisClient = config.REDIS_CLIENT;
      const redisKey = `confirmation_${email}`;
      const rCode = await redisClient.get(redisKey);
      if (rCode) {
        if (rCode === code) {
          const user = await User.findOne({ email: email });
          user.isUserConfirmed = true;
          user
            .save()
            .then(async () => {
              await redisClient.del(redisKey);
              resolve("User confirmed");
            })
            .catch((err) => {
              reject(`Could not save to DB: ${err}`);
            });
        } else {
          reject("Code does not match");
        }
      } else {
        reject("Code has expired or does not exist");
      }
    });
  }

  public async register(email: string, password: string) {
    const doesUserExist = await User.findOne({ email: email });
    if (doesUserExist) throw new Error("Email already in use");

    const uid = uuidv4();
    const salt = this.generateSalt();
    const username = uniqueNamesGenerator(customConfig);

    try {
      const passwordHashed = await argon2.hash(salt + password);
      const user = new User();
      user.username = username;
      user.email = email.trim();
      user.password = passwordHashed;
      user.isActive = true;
      user.uid = uid;
      user.salt = salt;
      user.isUserConfirmed = false;

      await user.save();
      this.sendConfirmationEmail(email.trim());
    } catch (error) {
      throw new Error(error);
    }
    return { email, username, uid };
  }

  generateSalt() {
    return crypto.randomBytes(16).toString("hex");
  }
}
