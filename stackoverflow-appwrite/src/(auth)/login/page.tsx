"use client";
import { useAuthStore } from "@/src/store/Auth";
import React from "react";

function LoginPage() {
    const { CreateAccount, login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit = async (error: React.FormEvent<HTMLFormElement>) => {
        error.preventDefault();

        // collect data 
        const formData = new FormData(error.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        // validation

        if (!email || !password) {
            setError(() => "Please fill all fields")
            return
        }

        //handle loading and error
        setIsLoading(() => true)
        setError(() => "")

        // login +> store
        const loginResponse = await login(email.toString(), password.toString())
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message)
        }
        setIsLoading(() => false)
    }
    return <div>Login Page</div>;
}

export default LoginPage