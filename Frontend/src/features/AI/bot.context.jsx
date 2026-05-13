/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const botContext = createContext()

export const BotProvider = ({ children }) => {
    const [userMessage, setUserMessage] = useState("");
    const [AiMessage, setAiMessage] = useState("");
    const [loading, setLoading] = useState(false);


    return (
        <botContext.Provider value={{ loading, setLoading, AiMessage, setAiMessage, userMessage, setUserMessage }}>
            {children}
        </botContext.Provider>
    )
}