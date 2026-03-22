import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import SkeletonLoader from "../../../components/SkeletonLoader"

const PublicRoute = ({children}) => {
    const { loading, user } = useAuth()

    if(loading){
        return <SkeletonLoader/>
    }

    // If user is already logged in, redirect to dashboard instead of showing login/signup
    if(user){
        return <Navigate to={'/dashboard'} />
    }
    
    return children
}

export default PublicRoute
