import { useContext } from "react"
import { botContext } from '../bot.context'
import { chatWithBot } from '../services/bot.api'

export const useBot = () => {
    const context = useContext(botContext)
    if (!context) {
        throw new Error('useBot must be used within a BotProvider');
    }
    const {
        userMessage,
        setUserMessage,
        AiMessage,
        setAiMessage,
        loading,
        setLoading,
    } = context

    const handleChatWithAi = async ({ userMessage, threadId }) => {
        setLoading(true)
        try {
            const data = await chatWithBot({ userMessage, threadId })
            setAiMessage(data.AiResult)
            return data
        } catch (err) {
            console.error('handleChatWithAi failed', err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        userMessage,
        setUserMessage,
        AiMessage,
        setAiMessage,
        loading,
        handleChatWithAi
    }
}