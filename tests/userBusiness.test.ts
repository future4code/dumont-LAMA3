
import {User, UserRole, UserInputDTO, LoginInputDTO} from "../src/business/entities/User"
import { CustomError } from "../src/business/error/CustomError"
import { UserBusiness } from "../src/business/UserBusiness"
import { UserDatabase } from "../src/data/UserDatabase"


const userDatabase = {
    createUser:jest.fn(async(user:User)=>{}),
    getUserByEmail:jest.fn((email:string)=>{
        if(email==="teste@gmail.com"){
            return User.toUserModel({
                id:"id_user",
                name:"name_user",
                email,
                password:"123456",
                userRole:UserRole.ADMIN
            })
        }else{
            throw new CustomError(404, "not found")
        }
    })
}
 const authenticator = {
     generateToken: jest.fn((payload: {id:string, role:UserRole}) => "token_testesdotoken"),
     getData:jest.fn((token:string)=>{
         switch(token){
             case"UserToken":
                return {id:"id_do_token", role: "NORMAL"}
             case "adminToken":
                 return {id:"id_do_token", role: "ADMIN"}
             default:
                return undefined
         }
     })
     
 
    }

    const idGenerator = {
      generate: jest.fn(()=>"bananinha")
    }

    const hashManager = {
      hash:jest.fn((password:string) => "LABENU_SECRET_PASS_HASH"),compareHash:jest.fn((text:string, hash:string)=> text === "123123"? true: false)
    } 

    const userBusiness = new UserBusiness(   
      userDatabase as any,
      hashManager as any,
      authenticator as any,
      idGenerator as any,
    );

    describe.skip("signUp test flow",() => {
      
      test("Shold return error when wrong email format", async()=>{

        expect.assertions(2)

        const user = {
          email:"emailteste.com",
          name: "Labenu",
          password: "123123",
          role: "NORMAL"
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){
          
          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid email format")
        }
      })

      test("Shold return error when wrong role format", async()=>{

        expect.assertions(2)
        
        const user = {
          email:"email@teste.com",
          name: "Labenu",
          password: "123123",
          role: "DIFFERENT"
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){
          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid user role")
          
        }
      })

      test("Shold return error when wrong password format", async()=>{

        expect.assertions(2)
        
        const user = {
          email:"email@teste.com",
          name: "Labenu",
          password: "123",
          role: "NORMAL"
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){
          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Password should have more than 6 digits")
          
          
        }
      })

      test("Shold return error when no password", async()=>{

        expect.assertions(2)
        
        const user = {
          email:"email@teste.com",
          name: "Labenu",
          role: "NORMAL"
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){

          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to signUp")
        }
      })

      test("Shold return error when no role", async()=>{

        expect.assertions(2)
        
        const user = {
          email:"email@teste.com",
          name: "Labenu",
          password: "123123",
          
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){

          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to signUp")
        }
      })

      test("Shold return error when no name", async()=>{

        expect.assertions(2)
        
        const user = {
          email:"email@teste.com",
          password: "123123",
          role: "NORMAL"
          
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){
          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to signUp")
          
        }
      })

      test("Shold return error when no email", async()=>{

        expect.assertions(2)
        
        const user = {
          name: "Labenu",
          password: "123123",
          role: "NORMAL"
          
        } as UserInputDTO

        try{
          await userBusiness.createUser(user)
        }catch(error){
          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to signUp")
          
        }
      })


      // test("Shold return token", async()=>{

      //   expect.assertions(1)
        
      //   const user = {
      //     email:"email@teste.com",
      //     name: "Labenu",
      //     password: "123123",
      //     role: "NORMAL"
          
      //   } as UserInputDTO

      //   const result = await userBusiness.createUser(user)
        
      //     expect(result).toBe("token_testesdotoken")

      // })

    })

    describe.skip("Login test flow", () =>{

      // test("Should return erro when no user linked to email", async() =>{

      //   expect.assertions(2)

      //   const userLogin = {
      //     email:"email@email.com",
      //     password: "123123",
      //   } as LoginInputDTO

      //   try{
      //     await userBusiness.getUserByEmail(userLogin)
      //   }catch(error){

      //     expect(error.statusCode).toBe(404)
      //     expect(error.message).toBe(`Unable to found user with email ${userLogin.email}`)
          
      //   }
      
      // })

      // test("Should return erro when password wrong", async() =>{

      //   expect.assertions(2)

      //   const userLogin = {
      //     email:"email@teste.com",
      //     password: "123987",
      //   } as LoginInputDTO

      //   try{
      //     await userBusiness.getUserByEmail(userLogin)
      //   }catch(error){

      //     expect(error.statusCode).toBe(417)
      //     expect(error.message).toBe("Invalid password")
          
      //   }
      
      // })

      test("Should return error when no password", async() =>{

        expect.assertions(2)

        const userLogin = {
          email:"email@teste.com",
          
        } as LoginInputDTO

        try{
          await userBusiness.getUserByEmail(userLogin)
        }catch(error){

          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to login")
        
        }
      })

      test("Should return error when no email", async() =>{

        expect.assertions(2)

        const userLogin = {
          password: "123123",
          
        } as LoginInputDTO

        try{
          await userBusiness.getUserByEmail(userLogin)
        }catch(error){

          expect(error.statusCode).toBe(417)
          expect(error.message).toBe("Invalid input to login")
        
        }
      })


      test("Shold return an accessToken", async()=>{

        expect.assertions(1)
        
        const userLogin = {
          email:"email@teste.com",
          password: "123987",
        } as LoginInputDTO


        const result = await userBusiness.getUserByEmail(userLogin)
        
          expect(result).toBe("token_testesdotoken")

      })
      

      
    })