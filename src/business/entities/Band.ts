import { CustomError } from "../error/CustomError";

export class Band {
   constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly music_genre: string,
      public readonly responsible: string
   ) { }
}

export interface BandInputDTO {
   id: string
   name: string
   music_genre: string
   responsible: string
}
