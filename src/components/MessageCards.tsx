"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'


type MessageCardProps = {
    message:Message;
    onMessageDelete: (messageId:string) => void;
}


function MessageCards({message , onMessageDelete}:MessageCardProps) {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-messages/${message._id}`)
            toast({
                title:response.data.message
            })
            onMessageDelete(message._id as string);

            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    }
    const date = new Date(message.createdAt);
    const formattedDate = date.toDateString();
    const formattedTime = date.toLocaleTimeString();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message?.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-12 flex justify-end dark:bg-red-700"><X className='w-5 h-5'/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>{formattedDate}, {formattedTime}</CardDescription>
            </CardHeader>
            <CardContent> 
            </CardContent>
            <CardFooter>  
            </CardFooter>
        </Card>
    )
}

export default MessageCards
