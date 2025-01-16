"use client"
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



function VerifyAccount() {
    const router = useRouter()
    const params = useParams<({username:string})>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        
    })

    const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post("/api/verify-code" , {
                username:params.username,
                code:data.code
            })
            toast({
                title:"success",
                description:response.data.message
            })
            router.replace(`/sign-in`)

        } catch (error) {
            console.log('error in verify the user', error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title:"verification Failure",
                description:errorMessage
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Anonymous Messaging
                    </h1>
                    <p className="mb-4">Verify to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Code" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                    <div className='text-center'>
                        <a href="/sign-in">Sign-In</a>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
