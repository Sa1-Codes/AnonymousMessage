import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"username must be atleast two character")
    .max(20,"username must be not more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username must no container apecial character ")
   
    
export const SignupSchema = z.object({
    username : usernameValidation,
    email:z.string().email({message:"invalid email format/address"}),
    password:z.string().min(6,{message:"password must be atleast 6 characters"})
})