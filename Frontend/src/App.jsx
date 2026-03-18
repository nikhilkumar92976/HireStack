import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context";
import {ResumeAnalysisProvider} from "./features/ResumeChecker/resumeAnalysis.context"
import { InterviewProvider } from "./features/interview/interview.context"

const App = () => {
  return (
    <AuthProvider>
      <ResumeAnalysisProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </ResumeAnalysisProvider>
    </AuthProvider>
  )
}

export default App
