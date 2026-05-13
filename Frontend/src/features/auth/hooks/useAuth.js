import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { userSingUp, userLogin, userLogout } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ identifire, password }) => {
        setLoading(true)
        try {
            const data = await userLogin({ identifire, password })
            setUser(data.user)
            // Store token in localStorage for persistence
            if (data.token) {
                localStorage.setItem('token', data.token)
            }
            return data // allow caller to know outcome
        } catch (err) {
            console.error('handleLogin failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleSingup = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await userSingUp({ username, email, password })
            setUser(data.user)
            // Store token in localStorage for persistence
            if (data.token) {
                localStorage.setItem('token', data.token)
            }
            return data
        } catch (err) {
            console.error('handleSingup failed', err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await userLogout()
            setUser(null)
            // Clear token from localStorage
            localStorage.removeItem('token')
        } catch (err) {
            console.log(err)
            // Still clear localStorage even if logout fails
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {

    //     const getAndSetUser = async () => {
    //         try {

    //             const data = await getMe()
    //             setUser(data.user)
    //         } catch (err) { } finally {
    //             setLoading(false)
    //         }
    //     }

    //     getAndSetUser()

    // }, [])

    return { user, loading, handleSingup, handleLogin, handleLogout }
}