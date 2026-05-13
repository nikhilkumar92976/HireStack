import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (!token) {
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected