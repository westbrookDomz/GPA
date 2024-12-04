"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import PerformanceOverview from "../components/PerformanceOverview";

const TranscriptUploadClient = dynamic(
  () => import("../components/TranscriptUploadClient"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-center">
        <div className="animate-pulse github-card p-4">
          Loading upload component...
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">
            Academic Performance Analysis
          </h1>
          <p className="text-github-fg-muted dark:text-github-dark-fg-muted">
            Upload your transcript to visualize your academic journey
          </p>
        </div>

        {/* Main Content */}
        <div className="github-card p-6">
          {!transcriptData ? (
            <TranscriptUploadClient onTranscriptParsed={setTranscriptData} />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setTranscriptData(null)}
                  className="github-button-primary"
                >
                  Upload Another Transcript
                </button>
              </div>
              <PerformanceOverview transcriptData={transcriptData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
