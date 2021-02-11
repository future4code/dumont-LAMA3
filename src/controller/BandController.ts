import { Request, Response } from "express";
import { BandInputDTO } from "../business/entities/Band";
import { LoginInputDTO } from "../business/entities/User";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { BandBusiness } from "../business/BandBusiness";
import { BandDatabase } from "../data/BandDatabase";

const bandBusiness = new BandBusiness(
   new IdGenerator(),
   new Authenticator(),
   new BandDatabase()
);

export class BandController {
   async register(req: Request, res: Response) {
      try {

         const input: BandInputDTO = {
            id: req.body.id,
            name: req.body.name,
            music_genre: req.body.music_genre,
            responsible: req.body.responsible
         }

         const token = req.headers.authorization as any

         await bandBusiness.createBand(input, token);

         res.status(200).send("Banda criada");

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }

   // async login(req: Request, res: Response) {

   //    try {

   //       const loginData: LoginInputDTO = {
   //          email: req.body.email,
   //          password: req.body.password
   //       };

   //       const token = await userBusiness.getUserByEmail(loginData);

   //       res.status(200).send({ token });

   //    } catch (error) {
   //       res
   //          .status(error.statusCode || 400)
   //          .send({ error: error.message });
   //    }
   // }

}