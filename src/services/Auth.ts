import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  names,
  starWars,
} from "unique-names-generator";

import { User } from "../entity/User";

const customConfig: Config = {
  dictionaries: [adjectives, names, starWars],
  separator: "-",
  length: 2,
};

export class AuthService {
  constructor() {}

  public async register(email: string, uid: string) {
    const doesUserExist = await User.findOne({ email: email });
    if (doesUserExist) throw new Error("Email already in use");

    const username = uniqueNamesGenerator(customConfig);

    try {
      const user = new User();
      user.username = username;
      user.email = email.trim();
      user.isActive = true;
      user.uid = uid;
      user.isUserConfirmed = false;

      await user.save();
    } catch (error) {
      throw new Error(error);
    }
    return { email, username, uid };
  }

  public async getUser(uid: string) {
    try {
      const user = await User.findOneOrFail({ uid: uid });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
