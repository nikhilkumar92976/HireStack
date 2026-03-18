import { useContext } from "react";
import { interviewContext } from "../interview.context"
import { startInterview, endInterview } from '../services/interview.api'

export const useInterview = () => {
    const context = useContext(interviewContext)
    if (!context) {
        throw new Error('interview context must be used within an interviewProvider');
    }

    const { loading, setLoading, interview, setInterview } = context

    const handleStartInterview = async ({ jobTitle, selfDescription, jobDescription }) => {
        setLoading(true)
        try {
            const data = await startInterview({ jobTitle, selfDescription, jobDescription })
            setInterview(data.interviewQuestion)
            return data // allow caller to know outcome
        } catch (err) {
            console.error(' handleStartInterview failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleEndInterview = async ({ responses,interview }) => {
        setLoading(true)
        try {
            const data = await endInterview({ responses,interview })
            setInterview(data.interview)
            return data // allow caller to know outcome
        } catch (err) {
            console.error(' handleStartInterview failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {loading,interview,handleStartInterview,handleEndInterview}
}
