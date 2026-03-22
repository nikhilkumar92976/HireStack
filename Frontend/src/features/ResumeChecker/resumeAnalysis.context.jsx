/* eslint-disable react-refresh/only-export-components */
import { createContext,useState } from "react";


export const ResumeAnalysisContext = createContext()


export const ResumeAnalysisProvider = ({ children }) => { 

    const [resumeAnalysis, setResumeAnalysis] = useState(null)
    const [allResumeAnalysis, setAllResumeAnalysis] = useState([])
    const [loading, setLoading] = useState(false)

    return (
        <ResumeAnalysisContext.Provider value={{resumeAnalysis,setResumeAnalysis,allResumeAnalysis,setAllResumeAnalysis,loading,setLoading}} >
            {children}
        </ResumeAnalysisContext.Provider>
    )

    
}