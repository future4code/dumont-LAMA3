import { ShowDatabase } from "../data/ShowDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";
import { ShowInputDTO } from "./entities/Show";

export class ShowBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private authenticator: Authenticator,
      private showDatabase: ShowDatabase,
   ) { }

   async createShow(show: ShowInputDTO, token: string) {

      const id = this.idGenerator.generate();

      const role = this.authenticator.getData(token)

      if (show.start_time<8 || show.start_time>=23 || show.end_time>23) {
         throw new CustomError(406,"Invalid time")
      }

      if (show.week_day !== "sexta" && show.week_day !== "sábado" && show.week_day !== "domingo") {
         throw new CustomError(406,"Invalid Week Day")
      }

      const showFromDB = await this.showDatabase.getShowsByDay(show.week_day)
      
      showFromDB[0].map((item: { start_time: number; end_time: number }) => {
         if (show.start_time < item.end_time && show.start_time >= item.start_time) {
            throw new CustomError(401,"Another event scheduled start")
         }
         if (show.end_time > item.start_time && show.end_time <= item.end_time) {
            throw new CustomError(401,"Another event scheduled end")
         }
         return item
      })

      if(!Number.isInteger(show.start_time) || !Number.isInteger(show.end_time)) {
         throw new CustomError(406,"Not integer time")
      }

      if(role.role!== "ADMIN") {
         throw new CustomError(401,"Unauthorized")
      }

      await this.showDatabase.createShow(
         id,
         show.week_day,
         show.start_time,
         show.end_time,
         show.band_id
      );
   }

   async getDetailsByDay(week_day: string) {

      const showFromDB = await this.showDatabase.getShowsByDay(week_day);
      
      return showFromDB[0];
   }
}