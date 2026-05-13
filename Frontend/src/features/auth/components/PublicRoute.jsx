import { Navigate } from "react-router";
import React from 'react'

const PublicRoute = ({ children }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (token) {
        return <Navigate to={'/dashboard'} />
    }

    return children
}

export default PublicRoute
