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

  return (
    <div className="min-h-screen">
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
          <PerformanceOverview transcriptData={transcriptData} />
        )}
      </div>
    </div>
  );
};

export default TranscriptAnalysis;
