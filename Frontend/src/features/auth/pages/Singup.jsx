import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'
import SkeletonLoader from '../../../components/SkeletonLoader'
import { toast } from "react-toastify";
import MarketingLayout from '../../../components/MarketingLayout';

const Signup = () => {
  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  const navigate = useNavigate()
  const {loading,handleSingup} = useAuth()

  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const res = await handleSingup({username,email,password})
            toast.success("Account created successfully!")
            if (res && res.user) {
                navigate("/dashboard")
            }
        } catch (err) {
            console.error('Signup error:', err)
            // Extract error message from backend response
            const errorMessage = err?.response?.data?.message || err?.message || 'Signup failed. Try again.'
            toast.error(err.message)
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
          <p className="text-sm font-medium text-blue-600">Create your account</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Start using HireStack with a public-first and protected-workspace flow.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            After signup you can move directly into the internal dashboard for resume building,
            resume analysis, mock interviews, and job search.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Signup</h2>
          <p className="mt-2 text-sm text-gray-500">Create a protected account to access all features.</p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e)=>{setUsername(e.target.value)}}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e)=>{setEmail(e.target.value)}}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e)=>{setPassword(e.target.value)}}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />

            <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
              Sign up
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            By creating an account, you can access the protected HireStack dashboard and its AI preparation tools.
          </p>

          <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
            <div className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to='/login' className="font-medium text-blue-600 cursor-pointer">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </MarketingLayout>
  );
};

export default Signup;