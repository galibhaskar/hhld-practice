"use client"
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const YoutubeHome = () => {
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const getVideos = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WATCH_SERVICE_URI}/home`
        );

        console.log("response:", response);

        setVideos(response.data);

        setLoading(false);
      } catch (error) {
        console.log("error:" + error);

        setLoading(false);
      }
    };

    getVideos();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="container mx-auto flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-10">
          {videos.map((_video) => {
            return (
              <div
                key={_video.id}
                className="border rounded-md overflow-hidden"
              >
                <div>
                  <ReactPlayer
                    url={_video.url}
                    controls
                    width={360}
                    height={180}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{_video.title}</h2>

                  <p className="text-gray-700">Author : {_video.author}</p>

                  <p className="text-gray-700">
                    Description : {_video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YoutubeHome;
