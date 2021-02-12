import { Request, Response } from "express";
import { ShowInputDTO } from "../business/entities/Show";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { ShowBusiness } from "../business/ShowBusiness";
import { ShowDatabase } from "../data/ShowDatabase";

const showBusiness = new ShowBusiness(
   new IdGenerator(),
   new Authenticator(),
   new ShowDatabase()
);

export class ShowController {
   async register(req: Request, res: Response) {
      try {

         const input: ShowInputDTO = {
            id: req.body.id,
            week_day: req.body.week_day,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            band_id: req.body.band_id
         }

         const token = req.headers.authorization as any

         await showBusiness.createShow(input, token);

         res.status(200).send({input});

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }

   async getDetailsByDay(req: Request, res: Response) {

      try {

         const {week_day} = req.params as any
         
         const result = await showBusiness.getDetailsByDay(week_day);
         
         res.status(200).send({result});

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }

}