import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'
import SkeletonLoader from '../../../components/SkeletonLoader'
import { toast } from "react-toastify";


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
                navigate("/")
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">

        {/* App Name */}
        <h1 className="text-3xl font-semibold text-center mb-8">
          Learnify
        </h1>

        {/* Login Form UI */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username or Email"
            onChange={(e)=>setIdentifire(e.target.value)}
            className="
              w-full px-3 py-2 text-sm
              border border-gray-300 rounded
              focus:outline-none focus:ring-1 focus:ring-black
            "
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="
              w-full px-3 py-2 text-sm
              border border-gray-300 rounded
              focus:outline-none focus:ring-1 focus:ring-black
            "
          />

          <button
            className="
              w-full py-2 mt-2
              text-sm font-medium text-white
              bg-black rounded
              active:scale-95 transition
            "
          >
            Log in
          </button>
        </div>

        {/* Forgot Password */}
        <p className="text-xs text-center text-gray-600 mt-4 cursor-pointer">
          Forgot password?
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Signup Redirect */}
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to='/singup' className="font-medium text-black cursor-pointer">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Login;