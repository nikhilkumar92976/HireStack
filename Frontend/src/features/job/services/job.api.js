import { api } from "../../../lib/apiClient";

export const getJobs = async (page = 1) => {
    try{
        const response = await api.get(`/job-search/jobs`, {
            params: { page },
        })
        return response.data
    }
    catch(err){
        console.error("getJobs error:", err?.response || err)
        throw err
    }       
}