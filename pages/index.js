"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import PerformanceOverview from "../components/PerformanceOverview";

const TranscriptUploadClient = dynamic(
  () => import("../components/TranscriptUploadClient"),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center">
        <div className="animate-pulse bg-blue-50 rounded-lg p-8">
          Loading upload component...
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-50 to-indigo-50 transform rotate-12 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white opacity-80" />
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Academic Performance
            <span className="block text-blue-600">Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your transcript to visualize your academic journey and get
            insights about your performance over the semesters.
          </p>
        </div>

        {/* Content area */}
        <div className="max-w-5xl mx-auto">
          {!transcriptData ? (
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <TranscriptUploadClient onTranscriptParsed={setTranscriptData} />
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-end">
                <button
                  onClick={() => setTranscriptData(null)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 
                            text-white rounded-lg hover:from-gray-700 hover:to-gray-800 
                            transition-all duration-200 shadow-lg hover:shadow-xl
                            flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Upload Another Transcript</span>
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <PerformanceOverview transcriptData={transcriptData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
