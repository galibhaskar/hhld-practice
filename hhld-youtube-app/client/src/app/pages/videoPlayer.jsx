"use client"
import React, { useEffect, useRef } from "react";
import HLS from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  const src = "https://djcon3lxjpsc5.cloudfront.net/hls/trail_mp4_master.m3u8";

  useEffect(() => {
    const video = videoRef.current;

    if (HLS.isSupported()) {
      console.log("HLS is supported");

      console.log(src);

      const hls = new HLS();

      hls.attachMedia(video);

      hls.loadSource(src);

      hls.on(HLS.Events.MANIFEST_PARSED, function () {
        console.log("playing video");

        video.play();
      });
    } else {
      console.log("HLS is not supported");
    }
  }, [src]);

  return <video ref={videoRef} controls />;
};

export default VideoPlayer;
