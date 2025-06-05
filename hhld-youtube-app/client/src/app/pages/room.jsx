"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function Room() {
  const [stream, setStream] = useState();

  const userStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setStream(stream);
  };

  return (
    <div>
      <div>
        <ReactPlayer
          width={100}
          height={100}
          url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
          controls
        />
      </div>

      <h1>Streaming</h1>
      <button
        type="button"
        onClick={userStream}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
dark:focus:ring-blue-800 m-10"
      >
        Go Live(Streaming)
      </button>
      <ReactPlayer url={stream} width={1080} height={500} autoPlay controls/>
    </div>
  );
}

export default Room;
