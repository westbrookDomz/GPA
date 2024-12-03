import React, { useState } from "react";
import TranscriptUpload from "../components/TranscriptUpload";
import PerformanceOverview from "../components/PerformanceOverview";

const TranscriptAnalysis = () => {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Transcript Analysis</h1>

      {/* Show upload component if no data */}
      {!transcriptData && (
        <TranscriptUpload onTranscriptParsed={setTranscriptData} />
      )}

      {/* Show results if we have data */}
      {transcriptData && (
        <div>
          <button
            onClick={() => setTranscriptData(null)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Upload Another
          </button>
          <PerformanceOverview transcriptData={transcriptData} />
        </div>
      )}
    </div>
  );
};

export default TranscriptAnalysis;
