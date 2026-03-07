import React from 'react'
import { useAuth } from '../auth/hooks/useAuth'

const Home = () => {
  const { handleLogout } = useAuth()

  return (
    <div>
      <h1>Home page</h1>
      
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        onClick={handleLogout}
      >

        Logout
      </button>
    </div>
  )
}

export default Home
