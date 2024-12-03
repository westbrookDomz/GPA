import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { parseTranscript } from "../utils/transcriptParser";
import * as XLSX from "xlsx";

const TranscriptUploadClient = ({ onTranscriptParsed }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const handleFileUpload = async (event) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);

      if (uploadedFile.type === "application/pdf") {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjs.getDocument(typedarray).promise;

          let textContent = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            textContent += content.items.map((item) => item.str).join(" ");
          }

          const parsedData = parseTranscript(textContent, "pdf");
          onTranscriptParsed(parsedData);
        };
        fileReader.readAsArrayBuffer(uploadedFile);
      } else if (
        uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              raw: false,
              defval: null,
              header: [
                "CourseCode",
                "CourseName",
                "Grade",
                "Credits",
                "Semester",
              ],
            });

            const parsedData = parseTranscript(jsonData, "excel");
            onTranscriptParsed(parsedData);
          } catch (error) {
            console.error("Error parsing Excel:", error);
            setError("Error parsing Excel file. Please check the format.");
          }
        };
        reader.readAsArrayBuffer(uploadedFile);
      }
    } catch (err) {
      setError("Error processing file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const input = document.createElement("input");
    input.files = e.dataTransfer.files;
    handleFileUpload({ target: { files: [droppedFile] } });
  };

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 loading-dots">Processing your transcript</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Your Transcript
        </h2>
        <p className="text-gray-600">
          Support for PDF and Excel (.xlsx) formats
        </p>
      </div>

      <div className="p-8">
        <div
          className={`flex justify-center items-center w-full ${
            isDragging
              ? "border-2 border-dashed border-blue-400 bg-blue-50"
              : "border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          } rounded-lg transition-all duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-12 h-12 text-gray-400 group-hover:text-gray-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="flex flex-col items-center">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PDF or Excel files only</p>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.xlsx"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {loading && <LoadingOverlay />}

        {error && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptUploadClient;
