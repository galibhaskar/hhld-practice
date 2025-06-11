"use client"
import React, { useEffect } from "react";
import UploadForm from "../components/uploadForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const UploadPage = () => {
  const { data } = useSession();

  useEffect(() => {
    console.log("session data:", data);

    if (!data) {
      console.log("invalid session data");

      redirect("/");
    }

    return () => {};
  }, []);

  return (
    <div className="m-10">
      <h1>UploadPage</h1>
      <UploadForm />
    </div>
  );
};

export default UploadPage;
