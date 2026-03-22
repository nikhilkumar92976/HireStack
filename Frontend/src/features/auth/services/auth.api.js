import { api } from "../../../lib/apiClient";

/**
 * @description Service to create a User Account
 */
export const userSingUp = async ({username,email,password}) => {
    try{
        // backend expects a POST with body data
        const response = await api.post(`/auth/singup`, { username, email, password })
        return response.data
    }
    catch(err){
        // rethrow so callers can handle errors if needed
        console.error("userSingUp error:", err?.response || err)
        throw err
    }
}


/**
 * @description Service to login user account
 */
export const userLogin = async ({identifire,password}) => {
    try{
        // use POST and send credentials in the request body
        const response = await api.post(`/auth/login`, { identifire, password })
        return response.data
    }
    catch(err){
        console.error("userLogin error:", err?.response || err)
        throw err
    }
}


/**
 * @description logout user account
 */
export const userLogout = async () => {
    try{
        // logout via POST is sometimes preferred but backend uses POST as well for /logout
        const response = await api.post(`/auth/logout`)
        return response.data
    }
    catch(err){
        console.error("userLogout error:", err?.response || err)
        throw err
    }
}

/**
 * @description Get current user profile
 */
export const getMe = async () => {
    try{
        const response = await api.get(`/auth/profile`)
        return response.data
    }
    catch(err){
        console.error("getMe error:", err?.response || err)
        throw err
    }
}
