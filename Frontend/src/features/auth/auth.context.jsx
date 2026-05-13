/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(() => {
        if (typeof window === 'undefined') return true
        return !!localStorage.getItem('token')
    })

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }

        const verifyToken = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch {
                localStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        verifyToken()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
