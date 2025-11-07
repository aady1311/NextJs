/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import React, { use, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios, {Axios} from "axios";
import toast from "react-hot-toast";
import { post } from "node_modules/axios/index.cjs";



export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    });

    const [setButtonDisabled] = useState(false);

    // useEffect(() => {
    //     if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
    //         setButtonDisabled(false);
    //     }else{
    //         setButtonDisabled(true);
    //     }
    // }, [user]);


      const buttonDisabled = useMemo(() => {
        return !(user.email.length > 0 && user.password.length > 0 && user.username.length > 0);
    }, [user.email.length, user.password.length, user.username.length]);

    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
       try {

        setLoading(true);
        const response = await axios.post("/api/users/signup", user);
        console.log("signup success", response.data);
        router.push("/login");
        
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch (error: any) {
        console.log("Signup failed",(error.message));
        toast.error(error.message);
       }finally{
        setLoading(false);
       }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <hr />
            <label htmlFor="username">username</label>
            <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            id="username"
             type="text"
             value={user.username}
             onChange={(e) => setUser({...user, username: e.target.value})}
             placeholder="username"

              />
            <label htmlFor="email">Email</label>
            <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            id="email"
             type="text"
             value={user.email}
             onChange={(e) => setUser({...user, email: e.target.value})}
             placeholder="email"

              />

            <label htmlFor="password">Password</label>
            <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            id="password"
             type="password"
             value={user.password}
             onChange={(e) => setUser({...user, password: e.target.value})}
             placeholder="password"
              />

              <button 
              onClick={onSignup}
              className="p-2 border broder-gray-300 rounderd-lg mb-4 focus:outline-none
              focus:border-gray-600"
              >{buttonDisabled ? "No signup" : "signup "}</button>
              <Link href="/login">Visit login page</Link>

        </div>
    )
}