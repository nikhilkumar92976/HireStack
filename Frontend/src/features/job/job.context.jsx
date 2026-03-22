/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useRef, useState } from "react";

export const jobContext = createContext()

export const JobProvider = ({children})=>{
    const [job,setJob] = useState([])
    const [loading,setLoading] = useState(false)
    const [jobCache, setJobCache] = useState({})
    const [lastPageReached, setLastPageReached] = useState(null)
    const jobCacheRef = useRef({})

    useEffect(() => {
        jobCacheRef.current = jobCache
    }, [jobCache])

    return (
        <jobContext.Provider value={{job,setJob,loading,setLoading,jobCache,setJobCache,jobCacheRef,lastPageReached,setLastPageReached}}>
            {children}
        </jobContext.Provider>
    )
}