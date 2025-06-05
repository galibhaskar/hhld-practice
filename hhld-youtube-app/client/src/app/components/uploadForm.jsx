"use client";
import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    console.log("handle file change called");
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:4000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
    } catch (exception) {
      console.log("exception in handleFileupload", exception);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button
          type="submit"
          className="text-white bg-gradient-to-br from-purple-600
to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm
px-5 py-2.5 text-center me-2 mb-2"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
