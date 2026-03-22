import { useCallback, useContext } from "react";
import {ResumeAnalysisContext} from '../resumeAnalysis.context'
import {getAllResumeAnalysis,getResumeAnalysisById,resumeAnaylsis} from '../services/resumeAnalysis.api'

export const useResumeAnalysis =()=>{
    const context = useContext(ResumeAnalysisContext)
    if (!context) {
            throw new Error('resume analysis context must be used within an resumeAnalysisProvider');
    }
    const { resumeAnalysis, setResumeAnalysis,allResumeAnalysis,setAllResumeAnalysis ,loading, setLoading } = context

    const handleResumeAnalysis = useCallback(async ({ title, resumeFile, selfDescription, jobDescription }) => {
        setLoading(true)
        try {
            const data = await resumeAnaylsis({ title, resumeFile, selfDescription, jobDescription })
            setResumeAnalysis(data.resumeAnalysis)
            return data // allow caller to know outcome
        } catch (err) {
            console.error(' handleResumeAnalysis failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setResumeAnalysis])

    const handleGetResumeAnalysisById = useCallback(async (id) => {
        setLoading(true)
        try {
            const data = await getResumeAnalysisById(id)
            setResumeAnalysis(data.resumeAnalysisResult)
            return data // allow caller to know outcome
        } catch (err) {
            console.error('handleGetResumeAnalysisById failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setResumeAnalysis])

    const handleGetAllResumeAnalysis = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllResumeAnalysis()
            setAllResumeAnalysis(data.previousAnalysis)
            return data // allow caller to know outcome
        } catch (err) {
            console.error('handleGetAllResumeAnalysis failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setAllResumeAnalysis])

    return {loading,resumeAnalysis,allResumeAnalysis,handleResumeAnalysis,handleGetResumeAnalysisById,handleGetAllResumeAnalysis}
}