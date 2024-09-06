"use client"

import React from 'react'
import Link from 'next/link'
import { useSession , signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'


function Navbar() {
    const {data:session} = useSession()
    const user:User = session?.user as User
    // const router = useRouter()
    const pathName = usePathname()


    return (
        <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-0" href="#">Anonymous Message</a>
                {
                    session?(
                        <>
                        <div className='flex flex-row gap-1 items-center'>
                            <span className="mr-4">Welcome, <span className='text-xl font-bold'>{user?.username || user?.email}</span></span>
                            <div className='flex flex-row gap-1'>
                            {
                                pathName=='/dashboard'?(<Link href={'/'}><Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>Home</Button></Link>) :
                                (<Link href={'/dashboard'}><Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>Dashboard</Button></Link>)
                            
                            }

                            
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline' onClick={()=>signOut()}>Logout</Button>
                            </div>
                        </div>
                        </>
                    ):(
                        <>
                        <Link href='/sign-up'>
                            <Button className=" bg-slate-100 text-black" variant={'outline'}>Sign Up</Button>
                        </Link>
                        <Link href='/sign-in'>
                            <Button className=" bg-slate-100 text-black" variant={'outline'}>Login</Button>
                        </Link>
                        
                        </>
                        
                        
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
