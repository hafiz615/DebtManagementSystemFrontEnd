import React, { useState, useEffect, useRef } from "react";

const TranscriptUI = ({ audioSrc, transcript }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const transcriptRefs = useRef([]);

  // Function to handle time updates
  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  // Determine active paragraph based on current time
  useEffect(() => {
    const index = transcript.findIndex(
      (item, i) =>
        currentTime >= item.time &&
        (i === transcript.length - 1 || currentTime < transcript[i + 1].time)
    );
    setActiveIndex(index);

    // Scroll to the active paragraph
    if (index !== -1 && transcriptRefs.current[index]) {
      transcriptRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, transcript]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Audio Player */}
      <audio
        controls
        onTimeUpdate={handleTimeUpdate}
        src={audioSrc}
        style={{ width: "100%" }}
      />

      {/* Transcript */}
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {transcript.map((item, index) => (
          <p
            key={index}
            ref={(el) => (transcriptRefs.current[index] = el)}
            style={{
              padding: "10px",
              backgroundColor:
                activeIndex === index ? "#f0f0f0" : "transparent",
              borderLeft: activeIndex === index ? "4px solid blue" : "none",
            }}
          >
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
};
