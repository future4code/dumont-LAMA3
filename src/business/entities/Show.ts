export class Show {
   constructor(
      public readonly id: string,
      public readonly week_day: string,
      public readonly start_time: number,
      public readonly end_time: number,
      public readonly band_id: string
   ) { }
}

export interface ShowInputDTO {
   id: string
   week_day: string
   start_time: number
   end_time: number
   band_id: string
}
