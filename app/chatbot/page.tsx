"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import ChatbotLoggedIn from "./components/ChatbotLoggedIn"
import ChatbotNotLoggedIn from "./components/ChatbotNotLoggedIn"

interface User {
    profile_pic?: string
    name?: string
}

export default function ChatbotPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("id")
            
            console.log("Chatbot - Token:", token ? "Present" : "Missing")
            console.log("Chatbot - User ID:", userId)
            
            if (!token) {
                setLoggedIn(false)
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                
                console.log("Chatbot - API Response:", response.data)
                setUser(response.data)
                setLoggedIn(true)
            } catch (err) {
                console.error("Failed to fetch user data:", err)
                setLoggedIn(false)
                
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    console.log("Chatbot - User not found, clearing localStorage")
                    localStorage.removeItem("token")
                    localStorage.removeItem("id")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            localStorage.removeItem("id")
            setUser(null)
            setLoggedIn(false)
            router.push("/auth")
        }
    }

    // Render appropriate chatbot component based on login status
    if (loggedIn && user) {
        return <ChatbotLoggedIn user={user} onLogout={handleLogout} />
    } else {
        return <ChatbotNotLoggedIn />
    }
}