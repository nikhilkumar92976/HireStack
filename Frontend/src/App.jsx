import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context";
import {ResumeAnalysisProvider} from "./features/ResumeChecker/resumeAnalysis.context"

const App = () => {
  return (
    <AuthProvider>
      <ResumeAnalysisProvider>
        <RouterProvider router={router} />
      </ResumeAnalysisProvider>
    </AuthProvider>
  )
}

export default App
