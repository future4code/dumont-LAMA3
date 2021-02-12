import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";
import { BandInputDTO } from "./entities/Band";

export class BandBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private authenticator: Authenticator,
      private bandDatabase: BandDatabase,
   ) { }

   async createBand(band: BandInputDTO, token: string) {

      const id = this.idGenerator.generate();

      const role = this.authenticator.getData(token)

      if(role.role!== "ADMIN") {
         throw new CustomError(401,"Unauthorized")
      }
      await this.bandDatabase.createBand(
         id,
         band.name,
         band.music_genre,
         band.responsible
      );
   }

   // async getUserByEmail(user: LoginInputDTO) {

   //    const userFromDB = await this.userDatabase.getUserByEmail(user.email);

   //    const passwordIsCorrect = await this.hashManager.compare(
   //       user.password,
   //       userFromDB.password
   //    );

   //    const accessToken = this.authenticator.generateToken({
   //       id: userFromDB.id,
   //       role: userFromDB.role
   //    });

   //    if (!passwordIsCorrect) {
   //       throw new CustomError(401, "Invalid credentials!");
   //    }

   //    return accessToken;
   // }

}