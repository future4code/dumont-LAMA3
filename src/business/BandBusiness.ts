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

   async getDetailsById(id: string) {

      const bandFromDB = await this.bandDatabase.getBandById(id);

      // Lembrar de função que busca o id entre vários
      if (id !== bandFromDB.id) {
         throw new CustomError(404, "Invalid Id");
      }

      if (!id) {
         throw new CustomError(404, "The id is required");
      }

      return bandFromDB;
   }

}