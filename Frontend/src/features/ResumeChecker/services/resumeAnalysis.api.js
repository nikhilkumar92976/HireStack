import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})

/**
 * @description Service to analysis resume based on inputs like resume file, job description, self introduction and job title
 */

export const resumeAnaylsis = async ({resumeFile, selfDescription, jobDescription, title}) => {
    try{
        // backend expects multipart/form-data with file upload
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('selfDescription', selfDescription || '');
        formData.append('jobDescription', jobDescription);
        formData.append('title', title);
        
        const response = await api.post(`/resume/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }
    catch(err){
        // rethrow so callers can handle errors if needed
        console.error("resume analysis error:", err?.response?.data || err?.message)
        throw err
    }
}

/**
 * @description Get resume analysis by id
 */
export const getResumeAnalysisById = async (id) => {
    try{
        const response = await api.get(`/resume/${id}`)
        return response.data
    }
    catch(err){
        console.error("resume analysis getting error:", err?.response || err)
        throw err
    }
}

/**
 * @description Get all user previous resume analysis
 */
export const getAllResumeAnalysis = async () => {
    try{
        const response = await api.get(`/resume/`)
        return response.data
    }
    catch(err){
        console.error("getting resume analysis error:", err?.response || err)
        throw err
    }
}

/**
 * @description Create resume using AI
 */
export const createResume = async (data) => {
    try{
        const response = await api.post('/resume/create-resume', data, {
            responseType: 'blob' // for PDF download
        })
        return response.data
    }
    catch(err){
        console.error("create resume error:", err?.response?.data || err?.message)
        throw err
    }
}