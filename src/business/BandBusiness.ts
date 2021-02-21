import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";
import { BandInputDTO } from "./entities/Band";
import { UserRole } from "./entities/User";

export class BandBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private authenticator: Authenticator,
      private bandDatabase: BandDatabase,
   ) { }

   async createBand(band: BandInputDTO, token: string) {

      

      if(!band.name || !band.music_genre || !band.responsible){
         throw new CustomError(417, "invalid input to registerBand");
      }

      const tokenData = this.authenticator.getData(token)

      if(tokenData.role!== "ADMIN") {
         throw new CustomError(401,"Unauthorized")
      }

      const id = this.idGenerator.generate();

      await this.bandDatabase.createBand(
         id,
         band.name,
         band.music_genre,
         band.responsible
      );
   }

   async getDetailsById(id: string) {

      const bandFromDB = await this.bandDatabase.getBandById(id);

      if(!id){
         throw new CustomError(404, "Invalid Id");
      }
      
     
      if (bandFromDB===undefined) {
         throw new CustomError(404, "Invalid Id");
      }
      
      return bandFromDB;
   }

}