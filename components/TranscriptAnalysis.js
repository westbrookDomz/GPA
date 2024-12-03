import React, { useState, useEffect } from "react";
import TranscriptUpload from "./TranscriptUpload";
import PerformanceOverview from "./PerformanceOverview";

const TranscriptAnalysis = () => {
  const [transcriptData, setTranscriptData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("transcriptData");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (transcriptData) {
      localStorage.setItem("transcriptData", JSON.stringify(transcriptData));
    }
  }, [transcriptData]);

  const clearSavedData = () => {
    localStorage.removeItem("transcriptData");
    setTranscriptData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Academic Performance Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your transcript to visualize your academic journey and get
            insights about your performance over the semesters.
          </p>
        </div>

        {!transcriptData ? (
          <div className="max-w-2xl mx-auto">
            <TranscriptUpload onTranscriptParsed={setTranscriptData} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setTranscriptData(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg 
                          hover:bg-gray-700 transition-colors duration-200
                          flex items-center space-x-2"
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
            <PerformanceOverview transcriptData={transcriptData} />
            <button
              onClick={clearSavedData}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Saved Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptAnalysis;
