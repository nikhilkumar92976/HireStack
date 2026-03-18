import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login"
import Singup from "./features/auth/pages/Singup";
import Home from "../src/pages/Home";
import Protected from "./features/auth/components/Protected"
import PublicRoute from "./features/auth/components/PublicRoute"
import ResumeChecker from "./features/ResumeChecker/pages/ResumeChecker";
import ResumeCheckerResults from "./features/ResumeChecker/pages/ResumeCheckerResults";
import CreateResume from "./features/ResumeChecker/pages/CreateResume";
import InterviewPage from "./features/interview/pages/InterviewPage"



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
    },
    {
        path: "/singup",
        element: <PublicRoute><Singup /></PublicRoute>
    },
    {
        path: "/",
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
])