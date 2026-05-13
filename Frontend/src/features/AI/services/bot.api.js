import { api } from "../../../lib/apiClient";

/**
 * @description Service to chat with Ai
 */

export const chatWithBot = async ({userMessage, threadId}) => {
    try{
        const response = await api.post(`/ai/chat`, {userMessage, threadId})
        return response.data
    }
    catch(err){
        console.error("faild to chat with bot error:", err?.response?.data || err?.message)
        throw err
    }
}