import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})

/**
 * @description Service to create interview with job description, self introduction and job title
 */

export const startInterview = async ({jobTitle, selfDescription, jobDescription}) => {
    try{
        const response = await api.post(`/interview/`, {jobTitle, selfDescription, jobDescription})
        return response.data
    }
    catch(err){
        // rethrow so callers can handle errors if needed
        console.error("faild to start interview error:", err?.response?.data || err?.message)
        throw err
    }
}

/**
 * @description Service to end the interv
 */

export const endInterview = async ({responses,interview}) => {
    try{
        const response = await api.post(`/interview/${interview}`, {responses})
        return response.data
    }
    catch(err){
        // rethrow so callers can handle errors if needed
        console.error("faild to submit interview response error:", err?.response?.data || err?.message)
        throw err
    }
}