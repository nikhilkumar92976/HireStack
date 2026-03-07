import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import SkeletonLoader from "../../../components/SkeletonLoader"

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return <SkeletonLoader />
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected