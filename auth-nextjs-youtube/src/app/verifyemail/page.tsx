"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const token = searchParams.get('token') || '';

    useEffect(() => {
        const verifyUserEmail = async () => {
            if(token.length === 0) return;
            
            setLoading(true);
            try {
                const response = await axios.post('/api/users/verifyemail', {token})
                console.log('Verification success:', response.data);
                setVerified(true);
                setError(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error:any) {
                setError(true);
                setVerified(false);
                const message = error.response?.data?.error || error.message;
                setErrorMessage(message);
                console.log('Verification error:', message);
            } finally {
                setLoading(false);
            }
        };
        
        verifyUserEmail();
    }, [token]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>
            
            {loading && (
                <div>
                    <h2 className="text-2xl">Verifying...</h2>
                </div>
            )}

            {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    <p className="text-red-600">{errorMessage}</p>
                </div>
            )}
        </div>
    )

}