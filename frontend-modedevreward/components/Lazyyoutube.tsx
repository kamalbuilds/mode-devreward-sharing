"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/page.module.css";

const LazyYoutube = ({ videoId }) => {
  const [load, setLoad] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoad(true);
        observer.disconnect();
      }
    });

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div ref={videoRef}>
      {load ? (
        <iframe
          className={styles.lazyYoutubeIframe}
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LazyYoutube;