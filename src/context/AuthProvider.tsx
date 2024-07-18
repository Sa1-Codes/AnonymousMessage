"use client"

import { SessionProvider } from "next-auth/react"
import {Session} from "next-auth";
export default function AuthProvider({
  children,session
}:{children: React.ReactNode;session?: Session | null;}) {
  // const session = getServerSession(authOptions)
  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
  )
}