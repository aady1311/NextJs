"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    
    const token = searchParams.get('token') || '';

    const onResetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/resetpassword", { 
                token, 
                password 
            });
            console.log("Password reset success", response.data);
            toast.success("Password reset successfully!");
            setPasswordReset(true);
        } catch (error: any) {
            console.log("Password reset failed", error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl mb-4">Invalid Reset Link</h1>
                <p className="mb-4">This password reset link is invalid or has expired.</p>
                <Link href="/forgotpassword" className="text-blue-500 hover:underline">
                    Request New Reset Link
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">{loading ? "Processing" : "Reset Password"}</h1>
            <hr className="mb-4" />
            
            {!passwordReset ? (
                <>
                    <label htmlFor="password">New Password</label>
                    <input 
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />
                    
                    <button
                        onClick={onResetPassword}
                        disabled={!password || !confirmPassword || loading}
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl text-green-600 mb-4">Password Reset Successfully!</h2>
                    <p className="mb-4">Your password has been updated.</p>
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login with New Password
                    </Link>
                </div>
            )}
        </div>
    );
}