import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login"
import Singup from "./features/auth/pages/Singup";
import Home from "../src/pages/Home";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Protected from "./features/auth/components/Protected"
import PublicRoute from "./features/auth/components/PublicRoute"
import ResumeChecker from "./features/ResumeChecker/pages/ResumeChecker";
import ResumeCheckerResults from "./features/ResumeChecker/pages/ResumeCheckerResults";
import CreateResume from "./features/ResumeChecker/pages/CreateResume";
import InterviewPage from "./features/interview/pages/InterviewPage"
import Job from "./features/job/pages/Job"
import Chatbot from "./features/AI/pages/chatbot"



export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/about",
        element: <AboutPage />
    },
    {
        path: "/contact",
        element: <ContactPage />
    },
    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
    },
    {
        path: "/singup",
        element: <PublicRoute><Singup /></PublicRoute>
    },
    {
        path: "/dashboard",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/resume-checker",
        element: <Protected><ResumeChecker /></Protected>
    },
    {
        path: "/resume-checker/results",
        element: <Protected><ResumeCheckerResults /></Protected>
    },
    {
        path: "/resume-checker/results/:id",
        element: <Protected><ResumeCheckerResults /></Protected>
    },
    {
        path: "/create-resume",
        element: <Protected><CreateResume /></Protected>
    },
    {
        path: "/interview",
        element: <Protected><InterviewPage /></Protected>
    },
    {
        path: "/job",
        element: <Protected><Job /></Protected>
    },
    {
        path: "/chat",
        element: <Protected><Chatbot /></Protected>
    },
])