import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, CheckCircle, AlertCircle, BookOpen, Zap } from "lucide-react";

const ResumeAnalysisResult = ({ analysis, onBack }) => {
  const [expandedTech, setExpandedTech] = useState(null);
  const [expandedBehavior, setExpandedBehavior] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    if (!analysis) return;
    
    const target = analysis.matchScore;
    const increment = target / 50;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [analysis]);

  if (!analysis) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const data = analysis;

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}

        {/* Header with Match Score - Combined Layout */}
        <div className="mb-10 opacity-0 animate-fadeIn" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header Background */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left Side - Title and Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {data.title}
                  </h1>
                  <p className="text-gray-600">Resume Analysis Report</p>
                </div>

                {/* Right Side - Animated Score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    {/* Background circle */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      {/* Animated progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={data.matchScore >= 75 ? "#10b981" : data.matchScore >= 50 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="3"
                        strokeDasharray={`${(displayScore / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.3s ease-out" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    {/* Score Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">{displayScore}</p>
                        <p className="text-xs text-gray-600">Match %</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex items-center gap-3">
              <BookOpen className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {data.jobDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Questions */}
        <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Technical Questions</h2>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                {data.technicalQuestions?.length || 0}
              </span>
            </div>

            <div className="divide-y divide-gray-200">
              {data.technicalQuestions?.map((q, index) => (
                <div key={index} className="hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() =>
                      setExpandedTech(expandedTech === index ? null : index)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="text-left text-gray-900 font-semibold flex-1">
                      Q{index + 1}: {q.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-blue-600 shrink-0 transition-transform duration-300 ${
                        expandedTech === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedTech === index && (
                    <div className="border-t border-gray-200 bg-blue-50/30 px-6 py-4 space-y-4">
                      {q.intention && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">💡 Intention:</p>
                          <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                            {q.intention}
                          </p>
                        </div>
                      )}

                      {q.answer && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">✅ Expected Answer:</p>
                          <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behavioral Questions */}
        <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Behavioral Questions</h2>
              </div>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
                {data.behavioralQuestions?.length || 0}
              </span>
            </div>

            <div className="divide-y divide-gray-200">
              {data.behavioralQuestions?.map((q, index) => (
                <div key={index} className="hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() =>
                      setExpandedBehavior(expandedBehavior === index ? null : index)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors"
                  >
                    <span className="text-left text-gray-900 font-semibold flex-1">
                      Q{index + 1}: {q.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-purple-600 shrink-0 transition-transform duration-300 ${
                        expandedBehavior === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedBehavior === index && (
                    <div className="border-t border-gray-200 bg-purple-50/30 px-6 py-4">
                      {q.answer && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">💬 Suggested Answer:</p>
                          <p className="text-gray-700 bg-white p-4 rounded border border-gray-200 leading-relaxed">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Skill Gaps</h2>
              </div>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                {data.skillGaps?.length || 0}
              </span>
            </div>

            <div className="p-6 flex flex-wrap gap-3">
              {data.skillGaps?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:border-red-300 transition-colors hover:scale-105 transform duration-200"
                >
                  📍 {skill.skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preparation Plan */}
        <div className="opacity-0 animate-fadeIn" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Preparation Plan</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.preparationPlan?.map((day, index) => (
                  <div
                    key={index}
                    className="bg-green-50/50 border border-green-200 rounded-lg p-5 hover:border-green-300 transition-colors hover:scale-105 transform duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {day.day}
                      </div>
                      <h3 className="font-semibold text-gray-900">Day {day.day}</h3>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 italic">{day.focus}</p>

                    <ul className="space-y-2">
                      {day.tasks?.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResumeAnalysisResult;