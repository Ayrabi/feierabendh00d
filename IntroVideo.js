import React, { useEffect, useRef } from "react";

export default function IntroVideo({ onFinished }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const handleEnded = () => {
      // Sanft ausblenden
      video.style.transition = "opacity 1.5s ease";
      video.style.opacity = 0;
      setTimeout(() => {
        onFinished();
      }, 1500);
    };
    video.addEventListener("ended", handleEnded);
    video.play();
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onFinished]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <video
        ref={videoRef}
        src="/intro.mov"  // <- Hier der Platzhalter für dein Video
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        playsInline
        muted
        autoPlay
      />
    </div>
  );
}
