import { UserInputDTO, LoginInputDTO } from "./entities/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator,
      private userDatabase: UserDatabase,
   ) { }

   async createUser(user: UserInputDTO) {

      if(!user.email || !user.name || !user.password || !user.role){
         throw new CustomError(417, "invalid input to signUp ");
      }

      if(user.email.indexOf("@") === -1){
         throw new CustomError(417, "invalid email format");
      }

      if(user.password.length < 6){
         throw new CustomError(417, "Password should have more than 6 digitis");
      }

      const id = this.idGenerator.generate();

      const hashPassword = await this.hashManager.hash(user.password);

      await this.userDatabase.createUser(
         id,
         user.email,
         user.name,
         hashPassword,
         user.role
      );

      const accessToken = this.authenticator.generateToken({
         id,
         role: user.role
      });

      return accessToken;
   }

   async getUserByEmail(user: LoginInputDTO) {

      const userFromDB = await this.userDatabase.getUserByEmail(user.email);

      const passwordIsCorrect = await this.hashManager.compare(
         user.password,
         userFromDB.password
      );

      const accessToken = this.authenticator.generateToken({
         id: userFromDB.id,
         role: userFromDB.role
      });

      if (!passwordIsCorrect) {
         throw new CustomError(417, "Invalid password");
      }

      return accessToken;
   }

}