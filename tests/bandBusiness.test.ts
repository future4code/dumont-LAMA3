import { BandBusiness } from "../src/business/BandBusiness"
import { Band, BandInputDTO } from "../src/business/entities/Band"
import { UserRole } from "../src/business/entities/User"
import { CustomError } from "../src/business/error/CustomError"

const bandDatabase = {
    createBand:jest.fn(async(band:Band)=>{}),
    getBandById:jest.fn((input:string)=>{
        if(input ==="idValido" || input === "nomeValido"){
            return {
                id:"idBanda",
                name:"Labanda",
                music_genre:"BACK N'ROLL",
                responsible:"Amandinha"
                        }
        }else{
            throw new CustomError(404, `Unable to found band with input:${input}`)
        }
    })
}
 const authenticator = {
     generateToken: jest.fn((payload: {id:string, role:UserRole}) => "token_testesdotoken"),
     getData:jest.fn((token:string)=>{
         switch(token){
             case"userToken":
                return {id:"id_do_token", role: "NORMAL"}
             case "adminToken":
                 return {id:"id_do_token", role: "ADMIN"}
             default:
                return undefined
         }
     })
     
 
    }
    const idGenerator = {
        generate: jest.fn(()=>"idBand")
      }

    const bandBusiness = new BandBusiness(
        bandDatabase as any,
        idGenerator as any,
        authenticator as any
    ) 

    describe("Register Band Test Flow",()=>{

        test("Should return error when no name", async()=>{
            expect.assertions(2)

            const token = "adminToken"
            const band ={
                music_genre: "BACK N'ROLL",
                responsible: "Severo"
            } as BandInputDTO

            try{
                await bandBusiness.createBand(band,token)
            }catch(error){
                expect(error.statusCode).toBe(417)
                expect(error.message).toBe("invalid input to registerBand")
            }
        })

        test("Should return error when no responsible", async()=>{
            expect.assertions(2)

            const token = "adminToken"
            const band ={
                name:"Darvas Band",
                music_genre: "BACK N'ROLL",
                
            } as BandInputDTO

            try{
                await bandBusiness.createBand(band,token)
            }catch(error){
                expect(error.statusCode).toBe(417)
                expect(error.message).toBe("invalid input to registerBand")
            }
        })
        test("Should return error when no music genre", async()=>{
            expect.assertions(2)

            const token = "adminToken"
            const band ={
                name:"Fulano Band",
                responsible: "Severo"
            } as BandInputDTO

            try{
                await bandBusiness.createBand(band,token)
            }catch(error){
                expect(error.statusCode).toBe(417)
                expect(error.message).toBe("invalid input to registerBand")
            }
        })

        // test("Should return error when user  is not ADMIN", async()=>{
        //     expect.assertions(1)

        //     const token = "userToken"
        //     const band ={
        //         name:"Uma Band",
        //         music_genre: "MPB",
        //         responsible: "Severo"
        //     } as BandInputDTO

        //     try{
        //         await bandBusiness.createBand(band,token)
        //     }catch(error){
        //         // expect(error.statusCode).toBe(401)
        //         expect(error.message).toBe("Unauthorized")
        //     }
        // })

        // test("Should register a band", async()=>{
        //     expect.assertions(1)

        //     const token = "adminToken"
        //     const band ={
        //         name:"Snape Band",
        //         music_genre: "FORRO",
        //         responsible: "Severo"
        //     } as BandInputDTO

            
        //         await bandBusiness.createBand(band,token)
            
        //         expect(bandDatabase.createBand).toHaveBeenCalledWith({

        //         "id":"idBand",
        //         "name":"Snape Band",
        //         "music_genre": "FORRO",
        //         "responsible": "Severo"

        //         })
            
        // })



    })

    describe("getBandDetailTest Flow",()=>{

        // test("Should return error when no input", async()=>{
        //     expect.assertions(2)

        //     const input = ""
           
        //     try{
        //         await bandBusiness.getDetailsById(input)
        //     }catch(error){
        //         expect(error.statusCode).toBe(404)
        //         expect(error.message).toBe("Invalid Id")
        //     }
        // })

        // test("Should return error when invalid input", async()=>{
        //     expect.assertions(1)

        //     const input = "qualquerIputInválido"
           
        //     try{
        //         await bandBusiness.getDetailsById(input)
        //     }catch(error){
        //         // expect(error.statusCode).toBe(404)
        //         expect(error.message).toBe( `Unable to found band with input:${input}`)
        //     }
        // })

        // test("Should return band when valid id", async()=>{
        //     expect.assertions(1)

        //     const input = "idValido"
           
        //     const result =  await bandBusiness.getDetailsById(input)
        //         expect(result).toBe({
        //         id:"idBanda",
        //         name:"Labanda",
        //         music_genre:"BACK N'ROLL",
        //         responsible:"Amandinha"
        //         })
        //     }
        // )

    })

    

