import { BaseDatabase } from "./BaseDatabase";
import { CustomError } from "../business/error/CustomError";
import { Band } from "../business/entities/Band";

export class BandDatabase extends BaseDatabase {

   private static TABLE_NAME = "LAMA_BANDAS";

   private static toBandModel(band: any): Band {
      return new Band(
         band.id,
         band.name,
         band.music_genre,
         band.responsible,
      );
   }

   public async createBand(
      id: string,
      name: string,
      music_genre: string,
      responsible: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               name,
               music_genre,
               responsible
            })
            .into(BandDatabase.TABLE_NAME);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   // public async getBandById(id: string): Promise<Band> {
   //    try {
   //       const result = await BaseDatabase.connection
   //          .select("*")
   //          .from(BandDatabase.TABLE_NAME)
   //          .where({ id });

   //       return BandDatabase.toBandModel(result[0]);
   //    } catch (error) {
   //       throw new CustomError(500, "An unexpected error ocurred");
   //    }
   // }
}