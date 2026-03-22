import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context";
import { ResumeAnalysisProvider } from "./features/ResumeChecker/resumeAnalysis.context"
import { InterviewProvider } from "./features/interview/interview.context"
import { JobProvider } from "./features/job/job.context"

const App = () => {
  return (
    <AuthProvider>
      <ResumeAnalysisProvider>
        <InterviewProvider>
          <JobProvider>
            <RouterProvider router={router} />
          </JobProvider>
        </InterviewProvider>
      </ResumeAnalysisProvider>
    </AuthProvider>
  )
}

export default App
