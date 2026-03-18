import { createContext , useState} from "react";

export const interviewContext = createContext(null)

export const InterviewProvider = ({children})=>{
    const [interview,setInterview] = useState(null)
    const [loading,setLoading] = useState(false)

    return (
        <interviewContext.Provider value={{interview, setInterview, loading,setLoading}}>
            {children}
        </interviewContext.Provider>
    )
}

export const interviewProvider = InterviewProvider