"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Message } from '@/model/User'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCards from '@/components/MessageCards'
import { User } from 'next-auth'
import Link from 'next/link'


function Page() {
    const [messages , setMessages] = useState<Message[]>([])
    const [isLoading , setisLoading] = useState(false)
    const [isSwitchLoading , setIsSwitchLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false);

    const {toast} = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message)=> message._id!== messageId))
    }

    const {data:session} = useSession();

    const form = useForm({
        resolver:zodResolver(acceptMessagesSchema)
    })

    const {register , watch ,setValue} = form;

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessge = useCallback(async ()=>{
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message')
            setValue("acceptMessages" , response.data.isAcceptingMessages)


        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to fetch messages settings",
                variant:"destructive"
            })
        } finally{
            setIsSwitchLoading(false);
        }


    },[setValue])

    const fetchMessages = useCallback(async (refresh:boolean = false)=>{
        setisLoading(true);
        setIsSwitchLoading(true);

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast({
                    title:"Refeshed Messages",
                    description:"Showing latest messages"
                })
            }


        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to fetch messages settings",
                variant:"destructive"
            })
        }finally{
            setisLoading(false);
            setIsSwitchLoading(false);
        }


    },[setIsSwitchLoading , setisLoading])

    useEffect(()=>{
        if(!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessge();

    },[session, setValue, fetchAcceptMessge ,fetchMessages])


    //handle switch change

    const handleSwitchChange = async ()=>{
        try {
            
            const response = await axios.post<ApiResponse>('/api/accept-message',{acceptMessages:!acceptMessages})
            setValue("acceptMessages" , !acceptMessages)
            toast({
                title:response.data.message,
                variant:'default'
            })


        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to fetch messages settings",
                variant:"destructive"
            })
        }
    }
    if (!session || !session.user) {
        return <div className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-600 text-white'>
            <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
                Welcome
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
                Anonymous Message - Where your identity remains a secret.
            </p>
            </section>
            <h1 className="text-3xl md:text-5xl font-bold">
                Please Sign-In
            </h1>
        </div>;
      }

    const {username} = session?.user as User
    //todo :research
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(profileUrl);
        toast({
            title:"URL copied",
            description:"Profile URL has been copied to clipboard"
        })
    }


    const getUser = async () => {
        try {
            const response = await axios.post('/api/get-user', {username:username})
            // console.log(response);
            setIsVerified(response.data.user.isVerified)
            // console.log(isVerified)
            

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to get Verification Status",
                variant:"destructive"
            })
        }
    }
    getUser();


    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy and Share Your Unique Link to Recieve Messages</h2>{' '}
                <div className="flex items-center">
                <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="input input-bordered w-full p-2 mr-2"
                />
                <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                />
                <span className="ml-2">
                Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
                }}
            >
                {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                messages.map((message, index) => (
                    <MessageCards
                        key={message._id as string}
                        message={message}
                        onMessageDelete={handleDeleteMessage}
                    />
                ))
                ) : (
                <p>No messages to display.</p>
                )}
            </div>
            <div className='mt-4 mb-4'></div>
            <Separator />
            <div className="mt-4 gap-6">
            {
                !isVerified? (
                    <div>
                        <h3 className=''>Your Email Address is Not Verified...</h3>
                        <Link href={`${baseUrl}/verify/${username}`} className='hover:underline'>Please verify Email</Link>
                    </div>
                ) : ("")
            }
            </div>
    </div>
    )
}

export default Page
