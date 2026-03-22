import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'
import SkeletonLoader from '../../../components/SkeletonLoader'
import { toast } from "react-toastify";
import MarketingLayout from '../../../components/MarketingLayout';


const Login = () => {

  const [identifire,setIdentifire] = useState("");
  const [password,setPassword] = useState("")

  const navigate = useNavigate()
  const {loading,handleLogin} = useAuth()

  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const result = await handleLogin({identifire,password})
            toast.success("login successfully")
            if (result && result.user) {
                navigate("/dashboard")
            }
        } catch (err) {
            console.error('Login error:', err)
            // Extract error message from backend response
            toast.error(err.message)
            const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.'
            setError(errorMessage)
        }
  }

  if(loading){
        return (<main className="max-w-4xl mx-auto">
      <SkeletonLoader />
    </main>)
  }
  return (
    <MarketingLayout>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_440px]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
          <p className="text-sm font-medium text-blue-600">Welcome back</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Sign in to continue with your preparation dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Access your resume tools, AI mock interview workspace, and job discovery flow from one protected account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
          <p className="mt-2 text-sm text-gray-500">Use your username or email to enter HireStack.</p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Username or Email"
              onChange={(e)=>setIdentifire(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />

            <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
              Log in
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
            <div className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to='/singup' className="font-medium text-blue-600 cursor-pointer">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </MarketingLayout>
  );
};

export default Login;