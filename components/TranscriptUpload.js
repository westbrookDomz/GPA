import dynamic from "next/dynamic";
import React from "react";

const TranscriptUploadClient = dynamic(
  () => import("./TranscriptUploadClient"),
  {
    ssr: false, // This is important - it prevents server-side rendering
    loading: () => (
      <div className="p-8 text-center">
        <div className="animate-pulse">Loading upload component...</div>
      </div>
    ),
  }
);

const TranscriptUpload = (props) => {
  return <TranscriptUploadClient {...props} />;
};

export default TranscriptUpload;
