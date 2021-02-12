import { BaseDatabase } from "./BaseDatabase";
import { CustomError } from "../business/error/CustomError";
import { Show } from "../business/entities/Show";

export class ShowDatabase extends BaseDatabase {

   private static TABLE_NAME = "LAMA_SHOWS";

   // private static toBandModel(band: any): Band {
   //    return new Band(
   //       band.id,
   //       band.name,
   //       band.music_genre,
   //       band.responsible,
   //    );
   // }

   public async createShow(
      id: string,
      week_day: string,
      start_time: number,
      end_time: number,
      band_id: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               week_day,
               start_time,
               end_time,
               band_id
            })
            .into(ShowDatabase.TABLE_NAME);
      } catch (error) {
         console.log(error)
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async getShowsByDay(week_day: string): Promise<any> {
      try {

         const result = await BaseDatabase.connection.raw(`
            SELECT ls.id, ls.week_day, ls.start_time, ls.end_time, lb.name as bandName, lb.music_genre FROM LAMA_SHOWS ls
            INNER JOIN LAMA_BANDAS lb ON lb.id=ls.band_id
            WHERE ls.week_day="${week_day}";
         `)

         return (result)

      } catch (error) {
         console.log(error)
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }
}