"use client";
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/Auth"
import React from "react"

const Layout = ({children}: {children: React.ReactNode}) => {
  const {session} = useAuthStore()
  const router = useRouter()

  React.useEffect(() => {
    if (session) {
      router.push("/")
    }
}, [session, router])
    
if(session){
    return null
}
 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
 ) 
}

export default Layout