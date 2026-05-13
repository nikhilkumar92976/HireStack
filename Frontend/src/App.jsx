import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context";
import { BotProvider } from "./features/AI/bot.context"
import { ResumeAnalysisProvider } from "./features/ResumeChecker/resumeAnalysis.context"
import { InterviewProvider } from "./features/interview/interview.context"
import { JobProvider } from "./features/job/job.context"

const App = () => {
  return (
    <AuthProvider>
      <BotProvider>
        <ResumeAnalysisProvider>
          <InterviewProvider>
            <JobProvider>
              <RouterProvider router={router} />
            </JobProvider>
          </InterviewProvider>
        </ResumeAnalysisProvider>
      </BotProvider>
    </AuthProvider>
  )
}

export default App
