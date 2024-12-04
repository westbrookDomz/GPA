"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseTranscript } from "../utils/transcriptParser";

const TranscriptUploadClient = ({ onTranscriptParsed }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        setError(null);
        setIsLoading(true);
        const file = acceptedFiles[0];
        if (!file) {
          throw new Error("No file selected");
        }

        const fileName = file.name.toLowerCase();
        let fileType;

        if (fileName.endsWith(".csv")) {
          fileType = "csv";
        } else if (fileName.endsWith(".xlsx")) {
          fileType = "excel";
        } else if (fileName.endsWith(".pdf")) {
          fileType = "pdf";
        } else {
          throw new Error(
            "Unsupported file format. Please use CSV, Excel, or PDF files."
          );
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const fileData = e.target.result;
            const parsedData = await parseTranscript(fileData, fileType);
            if (!parsedData) {
              throw new Error("Failed to parse file");
            }
            onTranscriptParsed(parsedData);
          } catch (err) {
            setError(err.message || "Error parsing transcript");
          } finally {
            setIsLoading(false);
          }
        };

        reader.onerror = () => {
          setError("Error reading file");
          setIsLoading(false);
        };

        if (fileType === "csv") {
          reader.readAsText(file);
        } else if (fileType === "excel") {
          reader.readAsBinaryString(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      } catch (err) {
        setError(err.message || "Error uploading file");
        setIsLoading(false);
      }
    },
    [onTranscriptParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          p-8 border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200
          bg-github-bg-secondary dark:bg-github-dark-bg-secondary
          border-github-border dark:border-github-dark-border
          hover:bg-github-bg dark:hover:bg-github-dark-bg
          ${
            isDragActive
              ? "border-github-accent dark:border-github-dark-accent"
              : ""
          }
          ${error ? "border-github-danger dark:border-github-dark-danger" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isLoading ? (
            <div className="text-github-fg-muted dark:text-github-dark-fg-muted">
              Processing...
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-github-fg-muted dark:text-github-dark-fg-muted"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M24 8v24m0-24L16 16m8-8l8 8m-8 24a16 16 0 110-32 16 16 0 010 32z"
                />
              </svg>

              <h3 className="mt-4 text-xl font-medium text-github-fg dark:text-github-dark-fg">
                Upload Your Transcript
              </h3>

              <p className="mt-2 text-sm text-github-fg-muted dark:text-github-dark-fg-muted">
                Support for CSV, Excel (.xlsx) and PDF formats
              </p>

              <p className="mt-1 text-sm text-github-fg-muted dark:text-github-dark-fg-muted">
                {isDragActive
                  ? "Drop the file here"
                  : "Click to upload or drag and drop"}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[var(--color-danger-subtle)] rounded-lg text-sm text-github-danger dark:text-github-dark-danger">
          {error}
        </div>
      )}
    </div>
  );
};

export default TranscriptUploadClient;
