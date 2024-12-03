import React, { useState } from "react";
import TranscriptUpload from "../components/TranscriptUpload";
import PerformanceOverview from "../components/PerformanceOverview";
import { sampleExcelData, samplePDFContent } from "../__tests__/sampleData";
import { parseTranscript } from "../utils/transcriptParser";

const TestPage = () => {
  const [transcriptData, setTranscriptData] = useState(null);

  const testExcelParsing = () => {
    const parsedData = parseTranscript(sampleExcelData, "excel");
    setTranscriptData(parsedData);
  };

  const testPDFParsing = () => {
    const parsedData = parseTranscript(samplePDFContent, "pdf");
    setTranscriptData(parsedData);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Transcript Analysis Testing</h1>

      <div className="space-y-8">
        {/* Test Buttons */}
        <div className="space-x-4">
          <button
            onClick={testExcelParsing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Excel Parsing
          </button>
          <button
            onClick={testPDFParsing}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test PDF Parsing
          </button>
        </div>

        {/* File Upload Testing */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Test File Upload</h2>
          <TranscriptUpload onTranscriptParsed={setTranscriptData} />
        </div>

        {/* Results Display */}
        {transcriptData && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Parsing Results</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(transcriptData, null, 2)}
            </pre>
            <div className="mt-8">
              <PerformanceOverview transcriptData={transcriptData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
