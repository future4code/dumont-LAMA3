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
         throw new CustomError(417, "Invalid input to signUp");
      }

      if(user.email.indexOf("@") === -1){
         throw new CustomError(417, "Invalid email format");
      }

      if(user.password.length < 6){
         throw new CustomError(417, "Password should have more than 6 digits");
      }

      if(user.role !== "NORMAL" && user.role !== "ADMIN"){
         throw new CustomError(417, "Invalid user role");
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

      if(!accessToken){
         throw new CustomError(417, "No token found");
      }

      return accessToken;
   }

   async getUserByEmail(user: LoginInputDTO) {

      if(!user.email || !user.password){
         throw new CustomError(417, "Invalid input to login");
      }

      if(user.email.indexOf("@") === -1){
         throw new CustomError(417, "Invalid email format");
      }

      const userFromDB = await this.userDatabase.getUserByEmail(user.email)

      console.log ("UserFormDB",userFromDB)

     
      const passwordIsCorrect = await this.hashManager.compare(
         user.password,
         userFromDB.password
      );

      if(!passwordIsCorrect){
         throw new CustomError(417, "Invalid password");
      }

      const accessToken = this.authenticator.generateToken({
         id: userFromDB.id,
         role: userFromDB.role
      });

      

      return accessToken;
   }

}