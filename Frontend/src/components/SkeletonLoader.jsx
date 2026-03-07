import React from 'react'

const SkeletonLoader = () => {
  return (
   <div className="animate-pulse p-4 space-y-4">
      
      {/* Title */}
      <div className="h-8 bg-gray-300 rounded w-1/3"></div>

      {/* Card */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Image placeholder */}
      <div className="h-48 bg-gray-300 rounded"></div>

      {/* Buttons */}
      <div className="flex gap-3">
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>

    </div>
  )
}

export default SkeletonLoader
