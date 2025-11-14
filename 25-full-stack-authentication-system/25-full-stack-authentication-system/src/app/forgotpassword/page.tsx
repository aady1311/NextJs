"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onForgotPassword = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/forgotpassword", { email });
            console.log("Forgot password success", response.data);
            toast.success("Password reset email sent!");
            setEmailSent(true);
        } catch (error: any) {
            console.log("Forgot password failed", error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">{loading ? "Processing" : "Forgot Password"}</h1>
            <hr className="mb-4" />
            
            {!emailSent ? (
                <>
                    <label htmlFor="email">Email</label>
                    <input 
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button
                        onClick={onForgotPassword}
                        disabled={!email || loading}
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl text-green-600 mb-4">Email Sent!</h2>
                    <p className="mb-4">Check your email for password reset instructions.</p>
                </div>
            )}
            
            <Link href="/login" className="text-blue-500 hover:underline">
                Back to Login
            </Link>
        </div>
    );
}